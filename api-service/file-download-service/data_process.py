import httpx
import logging
logging.basicConfig(level="INFO")
pubsub_url=f'http://localhost:3500/v1.0/publish/pubsub'
api_url = 'http://localhost:3500/v1.0/invoke/task-service/method'

def download(url, data_type, file_name, user_id, schedule_id):
    publish_data={
        "userId":user_id,
        "scheduleId":schedule_id,
        "url":url,
        "fileName":file_name,
        "dataType":data_type
    }
    history_data = httpx.get(
        f'{api_url}/api/history/{user_id}/{schedule_id}').json()
    if history_data == None:
        logging.info("新增")
        httpx.post(f'{pubsub_url}/addFile',json=publish_data)
    else:
        logging.info("修改")
        httpx.post(f'{pubsub_url}/updateFile',json=publish_data)
    
        
    logging.info(f'----------------END: {file_name}------------------------')
