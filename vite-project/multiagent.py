import sys
import json
from datetime import datetime
from dateutil.parser import parse as date_parse
import google.generativeai as genai
import requests

GOOGLE_API_KEY = "AIzaSyBjd2_-0uvUOMEylfMMTAI12JVl-RNKDuo"
genai.configure(api_key=GOOGLE_API_KEY)

MODEL_CONFIG = {
    "system_instruction": (
        "You are Rhea, Yuvika Spa's AI assistant. Key rules:\n"
        "1. Convert dates to YYYY-MM-DD format\n"
        "2. Validate dates are not weekends/past dates\n"
        "3. Collect service/date/time/name/email\n"
        "4. Use professional tone"
    )
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    tools=[{
        "function_declarations": [
            {
                "name": "check_available_slots",
                "description": "Check available time slots",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "service": {"type": "string"},
                        "date": {"type": "string"}
                    },
                    "required": ["service", "date"]
                }
            },
            {
                "name": "book_appointment",
                "description": "Book an appointment",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "email": {"type": "string"},
                        "service": {"type": "string"},
                        "date": {"type": "string"},
                        "time": {"type": "string"}
                    },
                    "required": ["name", "service", "date", "time","email"]
                }
            }
        ]
    }],
    system_instruction=MODEL_CONFIG["system_instruction"]
)

def validate_date(date_str):
    try:
        dt = parse(date_str)
        if dt.weekday() >= 5: return None, "Weekends not available"
        if dt.date() < datetime.now().date(): return None, "Past date invalid"
        return dt.strftime("%Y-%m-%d"), None
    except Exception as e:
        return None, f"Invalid date: {str(e)}"

def handle_api_call(args):
    try:
        if "date" in args:
            valid_date, error = validate_date(args["date"])
            if error: return {"error": error}
            args["date"] = valid_date
            
        if args.get("endpoint") == "available":
            response = requests.get(
                "https://yuvika-spa-house.onrender.com/spa/available",
                params=args,
                timeout=10
            )
        elif args.get("endpoint") == "book":
            response = requests.post(
                "https://yuvika-spa-house.onrender.com/spa/book",
                json=args,
                timeout=10
            )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def process_message(message):
    try:
        convo = model.start_chat()
        response = convo.send_message(message)
        
        if function_call := response.candidates[0].content.parts[0].function_call:
            result = handle_api_call(dict(function_call.args))
            convo.send_message(json.dumps(result))
            print(convo.last.text)
            return convo.last.text
        return response.text
        
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    for line in sys.stdin:
        try:
            message = line.strip()
            if not message: continue
            
            response = process_message(message)
            print(json.dumps({"response": response}))
            sys.stdout.flush()
            
        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.stdout.flush()
