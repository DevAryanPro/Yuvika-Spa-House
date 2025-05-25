import os
from datetime import datetime
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

# Function to check if ordering is allowed based on current day
def can_order_for_date(target_date_str):
    current_date = datetime.now()
    target_date = datetime.strptime(target_date_str, "%Y-%m-%d")
    
    # Check if target date is in the past
    if target_date.date() < current_date.date():
        return False
    
    current_weekday = current_date.weekday()  # Monday=0, Sunday=6
    
    # If today is Monday, Tuesday, Wednesday (0,1,2) - can order for this week
    if current_weekday in [0, 1, 2]:
        # Can order for current week (until Sunday)
        week_start = current_date - datetime.timedelta(days=current_weekday)
        week_end = week_start + datetime.timedelta(days=6)
        return week_start.date() <= target_date.date() <= week_end.date()
    
    # If today is Thursday or Friday (3,4) - can order for this week only
    elif current_weekday in [3, 4]:
        week_start = current_date - datetime.timedelta(days=current_weekday)
        week_end = week_start + datetime.timedelta(days=6)
        return week_start.date() <= target_date.date() <= week_end.date()
    
    # Saturday and Sunday (5,6) - cannot order for current week
    else:
        return False

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
            # Check date format
            datetime.strptime(v, "%Y-%m-%d")
            
            # Check ordering restrictions based on current day
            if not can_order_for_date(v):
                current_weekday = datetime.now().weekday()
                if current_weekday in [5, 6]:  # Weekend
                    raise ValueError('Orders cannot be placed on weekends for the current week')
                else:
                    raise ValueError('Date is outside the allowed ordering window')
            
            return v
        except ValueError as e:
            if "time data" in str(e):
                raise ValueError('Date must be in YYYY-MM-DD format')
            raise e
    
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
    
    # Check ordering restrictions
    if not can_order_for_date(date):
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
        # Check if slot is already booked
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
