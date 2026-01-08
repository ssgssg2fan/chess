FROM python:3.11-slim

# 시스템 패키지 설치 (여기서 stockfish)
RUN apt-get update \
 && apt-get install -y --no-install-recommends stockfish \
 && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y nodejs npm
RUN npm install chess.js

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "app:app", "--timeout", "120"]
