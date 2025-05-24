from fastapi import FastAPI
from tools.tts import router as tts_router
from tools.stt import router as stt_router
from tools.spa import router as spa_router

app = FastAPI()

app.include_router(tts_router, prefix="/tts")
app.include_router(stt_router, prefix="/stt")
app.include_router(spa_router, prefix="/spa")
