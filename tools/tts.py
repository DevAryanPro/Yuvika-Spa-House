from fastapi import APIRouter, Query, Response
import edge_tts
import tempfile
import os
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse

router = APIRouter()

@router.get("/")
async def root():
    return {
        "message": "Welcome to Edge TTS API. Use /tts/api/tts?text=Hello...",
        "credit": "Made by: @kaiiddo and @codiifycoders",
        "bug_report": "Report bugs: @DiscussionxGroup"
    }

@router.get("/api/tts")
async def tts_endpoint(text: str = Query(...), voice: str = "en-US-AriaNeural", rate: int = 0, pitch: int = 0):
    # Your existing logic here, same as before
    rate_str = f"{rate:+d}%"
    pitch_str = f"{pitch:+d}Hz"
    communicate = edge_tts.Communicate(text, voice, rate=rate_str, pitch=pitch_str)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
        tmp_path = tmp_file.name
        await communicate.save(tmp_path)

    play_url = f"/tts/api/play?file={os.path.basename(tmp_path)}"
    return HTMLResponse(f"""
        <h2>✅ Voice Generated</h2>
        <audio controls autoplay>
            <source src="{play_url}" type="audio/mpeg">
            Your browser does not support audio.
        </audio><br>
        <a href="{play_url}" download="output.mp3">
            <button>⬇️ Download MP3</button>
        </a>
    """)

@router.get("/api/play")
async def play_audio(file: str):
    path = os.path.join(tempfile.gettempdir(), file)
    if os.path.exists(path):
        return FileResponse(path, media_type="audio/mpeg", filename="output.mp3")
    return JSONResponse(status_code=404, content={"error": "File not found"})
    
