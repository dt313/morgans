from pathlib import Path

import httpx

from src.core.config import settings
from src.core.exceptions import AppException
from src.core.logger import get_logger

logger = get_logger(__name__)

ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

LANGUAGE_CODE = {"ko": "ko", "vi": "vi"}


class TTSClient:
    def __init__(self, api_key: str = settings.ELEVENLABS_API_KEY):
        self.api_key = api_key
        self._voice_ko: str | None = None
        self._voice_vi: str | None = None
        self._fallback_ko: bool = False
        self._fallback_vi: bool = False

    async def _list_voices(self) -> list[dict]:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                "https://api.elevenlabs.io/v1/voices",
                headers={"xi-api-key": self.api_key},
            )
        if response.status_code != 200:
            logger.error(
                f"ElevenLabs voices failed: {response.status_code} {response.text}"
            )
            return []
        return response.json().get("voices", [])

    async def _resolve_voice(self, language: str) -> str:
        if language == "ko":
            if self._fallback_ko:
                return settings.ELEVENLABS_FALLBACK_VOICE_ID
            configured = settings.KOREAN_VOICE_ID
        else:
            if self._fallback_vi:
                return settings.ELEVENLABS_FALLBACK_VOICE_ID
            configured = settings.VIETNAMESE_VOICE_ID

        if configured:
            return configured

        cached = self._voice_ko if language == "ko" else self._voice_vi
        if cached:
            return cached

        prefix = "ko-" if language == "ko" else "vi-"
        voices = await self._list_voices()
        matching = [
            voice
            for voice in voices
            if (voice.get("labels") or {}).get("language", "").lower() == f"{language} "
            or voice.get("name", "").lower().startswith(prefix)
        ]
        if not matching:
            matching = voices
        voice_id = matching[0]["voice_id"] if matching else ""
        if language == "ko":
            self._voice_ko = voice_id
        else:
            self._voice_vi = voice_id
        return voice_id

    async def synthesize(self, text: str, language: str) -> bytes:
        if not self.api_key:
            raise AppException(
                message="ElevenLabs API key is not configured",
                status_code=500,
            )

        voice_id = await self._resolve_voice(language)
        if not voice_id:
            raise AppException(
                message="No ElevenLabs voice available",
                status_code=502,
            )

        payload = {
            "text": text,
            "model_id": settings.ELEVENLABS_MODEL_ID,
            "language_code": LANGUAGE_CODE[language],
            "output_format": settings.ELEVENLABS_OUTPUT_FORMAT,
        }

        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                ELEVENLABS_URL.format(voice_id=voice_id),
                headers={
                    "xi-api-key": self.api_key,
                    "Content-Type": "application/json",
                },
                json=payload,
            )

        # Library voices require a paid plan; retry once with a premade voice.
        if (
            response.status_code == 402
            and voice_id != settings.ELEVENLABS_FALLBACK_VOICE_ID
        ):
            if language == "ko":
                self._fallback_ko = True
            else:
                self._fallback_vi = True
            logger.warning(
                f"Voice {voice_id} requires a paid plan ({language}); "
                f"falling back to {settings.ELEVENLABS_FALLBACK_VOICE_ID}"
            )
            fallback_voice = settings.ELEVENLABS_FALLBACK_VOICE_ID
            async with httpx.AsyncClient(timeout=90) as client:
                response = await client.post(
                    ELEVENLABS_URL.format(voice_id=fallback_voice),
                    headers={
                        "xi-api-key": self.api_key,
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )

        if response.status_code != 200:
            logger.error(
                f"ElevenLabs TTS failed: {response.status_code} {response.text}"
            )
            raise AppException(
                message="Failed to generate audio",
                status_code=502,
            )

        return response.content


class TTSService:
    def __init__(self):
        self.client = TTSClient()

    def _cache_path(self, article_id: int, language: str) -> Path:
        directory = Path(settings.AUDIO_CACHE_DIR)
        return directory / f"article_{article_id}_{language}.mp3"

    def get_audio(self, article_id: int, language: str) -> Path | None:
        path = self._cache_path(article_id, language)
        return path if path.is_file() else None

    async def generate_audio(self, article_id: int, language: str, text: str) -> Path:
        path = self._cache_path(article_id, language)
        if path.is_file():
            return path

        audio = await self.client.synthesize(text, language)

        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(audio)
        logger.info(f"Generated audio for article {article_id} ({language}): {path}")
        return path


tts_service = TTSService()
