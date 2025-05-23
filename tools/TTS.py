from fastapi import FastAPI, Query
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
import edge_tts
import tempfile
import os

app = FastAPI()

CREDIT = "Made by: @kaiiddo"
BUG_REPORT = "Report bugs: @Group"
FILENAME = "Love By Kaiiddo.mp3"

@app.get("/")
async def root():
    
    return {
        "message": "Welcome to Edge TTS API. Use /api/tts?text=Hello&voice=en-US-AriaNeural&rate=0&pitch=0",
        "credit": CREDIT,
        "bug_report": BUG_REPORT
    }

@app.get("/api/tts")
async def tts_endpoint(
    text: str = Query(..., description="Text to convert to speech"),
    voice: str = Query("en-US-AriaNeural"),
    rate: int = Query(0),
    pitch: int = Query(0)
):
    if not text.strip():
        return JSONResponse(
            status_code=400,
            content={"error": "Text is required", "credit": CREDIT, "bug_report": BUG_REPORT}
        )

    rate_str = f"{rate:+d}%"
    pitch_str = f"{pitch:+d}Hz"
    communicate = edge_tts.Communicate(text, voice, rate=rate_str, pitch=pitch_str)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
        tmp_path = tmp_file.name
        await communicate.save(tmp_path)

    play_url = f"/api/play?file={os.path.basename(tmp_path)}"
    return HTMLResponse(content=f"""
        <h2>✅ Voice Generated</h2>
        <audio controls autoplay>
            <source src="{play_url}" type="audio/mpeg">
            Your browser does not support audio.
        </audio><br>
        <a href="{play_url}" download="{FILENAME}">
            <button>⬇️ Download MP3</button>
        </a>
    """)

@app.get("/api/play")
async def play_audio(file: str):
    path = os.path.join(tempfile.gettempdir(), file)
    if os.path.exists(path):
        return FileResponse(path, media_type="audio/mpeg", filename=FILENAME)
    return JSONResponse(status_code=404, content={"error": "File not found"})
