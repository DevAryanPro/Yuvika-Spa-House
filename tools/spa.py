from fastapi import APIRouter, Query, HTTPException, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from supabase import create_client, Client

router = APIRouter()

SUPABASE_URL = "https://oznubufxhelabkpqfglu.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bnVidWZ4aGVsYWJrcHFmZ2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjAwNTksImV4cCI6MjA2MzU5NjA1OX0.K44q4hxkDFco1DBdH6mOGaNREG_mMinCHSRfRscTMIY"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

ALL_SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]

class BookingRequest(BaseModel):
    name: str
    email: str = None  # optional
    service: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM

@router.get("/")
async def root():
    return {
        "message": "Welcome to the Spa Booking API. Use /available and /book endpoints.",
        "author": "Made by @kaiiddo and @codiifycoders"
    }

@router.get("/available")
async def available(service: str = Query(...), date: str = Query(...)):
    response = supabase.table("appointments") \
        .select("time") \
        .eq("service", service) \
        .eq("date", date) \
        .eq("status", "booked") \
        .execute()

    if response.error:
        raise HTTPException(status_code=500, detail=response.error.message)

    booked_times = [item["time"] for item in response.data]
    available_slots = [slot for slot in ALL_SLOTS if slot not in booked_times]

    return JSONResponse(content={"service": service, "date": date, "available_slots": available_slots})

@router.post("/book")
async def book(booking: BookingRequest = Body(...)):
    # Check if slot already booked
    response = supabase.table("appointments") \
        .select("*") \
        .eq("service", booking.service) \
        .eq("date", booking.date) \
        .eq("time", booking.time) \
        .eq("status", "booked") \
        .execute()

    if response.error:
        raise HTTPException(status_code=500, detail=response.error.message)

    if len(response.data) > 0:
        raise HTTPException(status_code=400, detail="Time slot already booked")

    insert_resp = supabase.table("appointments").insert([{
        "name": booking.name,
        "email": booking.email,
        "service": booking.service,
        "date": booking.date,
        "time": booking.time,
        "status": "booked"
    }]).execute()

    if insert_resp.error:
        raise HTTPException(status_code=500, detail=insert_resp.error.message)

    return JSONResponse(content={
        "success": True,
        "message": f"Booked {booking.service} for {booking.name} at {booking.time} on {booking.date}"
    })
