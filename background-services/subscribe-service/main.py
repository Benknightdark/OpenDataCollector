from fastapi import FastAPI, Request
import os
import logging
import data_process
import httpx
logging.basicConfig(level="INFO")

if os.getenv("ENVIRONMENT") == 'production':

    app = FastAPI(docs_url=None, redoc_url=None)
else:
    app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'addFile', 'route': '/addFile'},
        {'pubsubname': 'pubsub', 'topic': 'updateFile', 'route': '/updateFile'}
    ]
    return (subscriptions)


@app.post('/addFile')
async def add_file_subscriber(request: Request):
    data = await request.json()
    await data_process.add_file(data['data'])
    print(data)
    return data


@app.post('/updateFile')
async def add_file_subscriber(request: Request):
    data = await request.json()
    await data_process.update_file(data['data'])
    return data

@app.post('/cron')
async def add_file_subscriber(request: Request):
    print("OKOKOK")
    print(httpx.get('http://localhost:3500/v1.0/secrets/kubernetes/opendatasecrets').json())
    return {"status":"OK"}