# model-backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install pytest # Also install pytest

# Copy all other files from the model-backend directory
COPY . .