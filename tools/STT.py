from fastapi import FastAPI, UploadFile, File, HTTPException
import speech_recognition as sr
import shutil

app = FastAPI()

@app.post("/speech-to-text/")
async def speech_to_text(file: UploadFile = File(...)):
    if not file.filename.endswith((".wav", ".flac", ".aiff", ".aif", ".mp3")):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Save uploaded file locally
    file_location = f"temp_audio_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(file_location) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data, language='en-US')
        return {"text": text}

    except sr.UnknownValueError:
        return {"error": "Could not understand audio"}
    except sr.RequestError as e:
        return {"error": f"Could not request results from Google Speech Recognition service; {e}"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        import os
        if os.path.exists(file_location):
            os.remove(file_location)
            
