FROM python:alpine
EXPOSE 8999
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV TZ=Asia/Taipei
ENV PYTHONUNBUFFERED=1
COPY . .
RUN python -m pip install -r requirements.txt
ENV FLASK_DEBUG=1
CMD ["python","app.py"]
