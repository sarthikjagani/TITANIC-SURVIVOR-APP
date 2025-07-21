# backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of the backend application code
COPY ./app /app/

# Command to run the application (assuming you use Flask or FastAPI)
CMD ["python", "main.py"]