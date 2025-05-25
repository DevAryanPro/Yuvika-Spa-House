import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Query, HTTPException, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, validator
from supabase import create_client, Client

router = APIRouter()

# Use environment variables for security
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://oznubufxhelabkpqfglu.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bnVidWZ4aGVsYWJrcHFmZ2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjAwNTksImV4cCI6MjA2MzU5NjA1OX0.K44q4hxkDFco1DBdH6mOGaNREG_mMinCHSRfRscTMIY")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    raise RuntimeError(f"Failed to initialize Supabase client: {e}")

ALL_SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
VALID_SERVICES = ["massage", "facial", "manicure", "pedicure", "spa_package"]

def can_order_for_date(target_date_str, target_time_str=None):
    current_date = datetime.now()
    target_date = datetime.strptime(target_date_str, "%Y-%m-%d")
    
    if target_date.date() < current_date.date():
        return False
    
    if target_date.date() == current_date.date() and target_time_str:
        target_datetime = datetime.strptime(f"{target_date_str} {target_time_str}", "%Y-%m-%d %H:%M")
        if target_datetime <= current_date:
            return False
    
    current_weekday = current_date.weekday()  # Monday=0, Sunday=6
    current_week_start = current_date - timedelta(days=current_weekday)
    current_week_end = current_week_start + timedelta(days=6)
    
    next_week_start = current_week_start + timedelta(days=7)
    next_week_end = current_week_end + timedelta(days=7)
    
    if current_weekday in [0, 1, 2, 3, 4]:
        return (current_week_start.date() <= target_date.date() <= current_week_end.date()) or \
               (next_week_start.date() <= target_date.date() <= next_week_end.date())
    
    else:
       return next_week_start.date() <= target_date.date() <= next_week_end.date()

class BookingRequest(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    service: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()
    
    @validator('service')
    def validate_service(cls, v):
        if v not in VALID_SERVICES:
            raise ValueError(f'Service must be one of: {", ".join(VALID_SERVICES)}')
        return v
    
    @validator('date')
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')

    @validator('time')
    def validate_time(cls, v):
        if v not in ALL_SLOTS:
            raise ValueError(f'Time must be one of: {", ".join(ALL_SLOTS)}')
        return v

@router.get("/")
async def root():
    return {
        "message": "Welcome to the Spa Booking API",
        "endpoints": {
            "available": "GET /available?date=YYYY-MM-DD&time=HH:MM",
            "book": "POST /book",
            "bookings": "GET /bookings?email=EMAIL (optional)"
        },
        "services": VALID_SERVICES,
        "time_slots": ALL_SLOTS,
        "author": "Made by @kaiiddo and @codiifycoders"
    }

@router.get("/available")
async def check_availability(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    time: str = Query(..., description="Time in HH:MM format")
):
    # Validate date format
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Date must be in YYYY-MM-DD format")
    
    # Validate time format and check if it's in allowed slots
    if time not in ALL_SLOTS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid time. Must be one of: {', '.join(ALL_SLOTS)}"
        )
    
    # Check ordering restrictions with time validation
    if not can_order_for_date(date, time):
        return JSONResponse(content={"available": False})
    
    try:
        # Check if the specific date and time slot is already booked
        response = supabase.table("appointments") \
            .select("id") \
            .eq("date", date) \
            .eq("time", time) \
            .eq("status", "booked") \
            .execute()
        
        is_available = len(response.data) == 0
        
        return JSONResponse(content={"available": is_available})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("/book")
async def create_booking(booking: BookingRequest = Body(...)):
    try:
        # First, validate ordering restrictions with time
        if not can_order_for_date(booking.date, booking.time):
            current_weekday = datetime.now().weekday()
            target_date = datetime.strptime(booking.date, "%Y-%m-%d").date()
            current_date = datetime.now().date()
            
            if current_weekday in [5, 6]:  # Weekend
                raise HTTPException(status_code=400, detail="Weekend users can only book for next week")
            else:
                # Check if it's a time validation issue (same day, past time)
                if target_date == current_date:
                    target_datetime = datetime.strptime(f"{booking.date} {booking.time}", "%Y-%m-%d %H:%M")
                    if target_datetime <= datetime.now():
                        raise HTTPException(status_code=400, detail="Cannot book for past time")
                
                raise HTTPException(status_code=400, detail="Date is outside allowed ordering window")
        
        # Rest of the method remains the same...
        existing = supabase.table("appointments") \
            .select("*") \
            .eq("service", booking.service) \
            .eq("date", booking.date) \
            .eq("time", booking.time) \
            .eq("status", "booked") \
            .execute()
        
        if len(existing.data) > 0:
            raise HTTPException(
                status_code=409, 
                detail="Time slot already booked. Please choose another time."
            )
        
        # Create the booking
        booking_data = {
            "name": booking.name,
            "service": booking.service,
            "date": booking.date,
            "time": booking.time,
            "status": "booked",
            "created_at": datetime.now().isoformat()
        }
        
        if booking.email:
            booking_data["email"] = booking.email
        
        insert_response = supabase.table("appointments").insert([booking_data]).execute()
        
        return JSONResponse(
            status_code=201,
            content={
                "success": True,
                "message": f"Successfully booked {booking.service} for {booking.name} at {booking.time} on {booking.date}",
                "booking_id": insert_response.data[0]["id"] if insert_response.data else None
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Booking failed: {str(e)}")


@router.get("/bookings")
async def get_bookings(email: Optional[str] = Query(None, description="Filter by email")):
    try:
        query = supabase.table("appointments").select("date, time, status").eq("status", "booked")
        
        if email:
            query = query.eq("email", email)
        
        response = query.execute()
        
        return JSONResponse(content={
            "bookings": response.data,
            "total": len(response.data)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bookings: {str(e)}")
