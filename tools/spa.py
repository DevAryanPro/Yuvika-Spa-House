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
VALID_SERVICES = ["massage", "facial", "manicure", "pedicure", "spa_package"]  # Add your services

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
            date_obj = datetime.strptime(v, "%Y-%m-%d")
            if date_obj.date() < datetime.now().date():
                raise ValueError('Date cannot be in the past')
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
            "available": "GET /available?service=SERVICE&date=YYYY-MM-DD",
            "book": "POST /book",
            "bookings": "GET /bookings?email=EMAIL (optional)"
        },
        "services": VALID_SERVICES,
        "time_slots": ALL_SLOTS,
        "author": "Made by @kaiiddo and @codiifycoders"
    }

@router.get("/available")
async def get_available_slots(
    service: str = Query(..., description="Service type"),
    date: str = Query(..., description="Date in YYYY-MM-DD format")
):
    # Validate inputs
    if service not in VALID_SERVICES:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid service. Must be one of: {', '.join(VALID_SERVICES)}"
        )
    
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        if date_obj.date() < datetime.now().date():
            raise HTTPException(status_code=400, detail="Date cannot be in the past")
    except ValueError:
        raise HTTPException(status_code=400, detail="Date must be in YYYY-MM-DD format")
    
    try:
        response = supabase.table("appointments") \
            .select("time") \
            .eq("service", service) \
            .eq("date", date) \
            .eq("status", "booked") \
            .execute()
        
        booked_times = [item["time"] for item in response.data]
        available_slots = [slot for slot in ALL_SLOTS if slot not in booked_times]
        
        return JSONResponse(content={
            "service": service,
            "date": date,
            "available_slots": available_slots,
            "booked_slots": booked_times
        })
        
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
        query = supabase.table("appointments").select("*").eq("status", "booked")
        
        if email:
            query = query.eq("email", email)
        
        response = query.execute()
        
        return JSONResponse(content={
            "bookings": response.data,
            "total": len(response.data)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bookings: {str(e)}")

@router.delete("/book/{booking_id}")
async def cancel_booking(booking_id: str):
    try:
        # Update status to cancelled instead of deleting
        response = supabase.table("appointments") \
            .update({"status": "cancelled"}) \
            .eq("id", booking_id) \
            .eq("status", "booked") \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Booking not found or already cancelled")
        
        return JSONResponse(content={
            "success": True,
            "message": "Booking cancelled successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cancellation failed: {str(e)}")
