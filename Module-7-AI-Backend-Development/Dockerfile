FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    FLASK_APP=run.py

WORKDIR /app

# Layer 1: dependencies (cached when requirements.txt unchanged)
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt gunicorn

# Layer 2: application code
COPY app/ ./app/
COPY run.py .
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

RUN mkdir -p instance/uploads

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:5000/health')" || exit 1

CMD ["./docker-entrypoint.sh"]
