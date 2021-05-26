FROM python:alpine
EXPOSE 8782
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN python -m pip install -r requirements.txt
WORKDIR /app
COPY . /app
CMD ["uvicorn","main:app","--host", "0.0.0.0", "--port", "8782"]
