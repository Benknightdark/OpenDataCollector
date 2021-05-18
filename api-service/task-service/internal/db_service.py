from pymongo import MongoClient
import os
from bson import json_util
import json
from bson.objectid import ObjectId

def convert_collection(data):
    '''
    轉換Collection資料形態
    '''
    return json.loads(json_util.dumps(data))
def db(db_name):
    '''
    取得MongoDB 資料庫
    '''
    if os.getenv('ENVIRONMENT') == 'production':
        db_uri =('mongodb://root:example@mongo/')
    else:
        db_uri =('mongodb://root:example@localhost:1769/')    
    db_client = MongoClient(db_uri)
    return db_client[db_name]  
def schedule_query_by_userid(user_id):
    '''
    查詢特定使用者的排程資料
    '''
    return convert_collection(db('task')['schedule'].find_one({'userId':user_id}))
def schedule_query():
    '''
    查詢所有使用者的排程資料
    '''
    return convert_collection(db('task')['schedule'].find())    
def add_schedule(user_id,data_id):
    '''
    新增特定使用者的排程資料
    '''
    return convert_collection(db('task')['schedule'].find())      
def update_schedule(user_id,data_id):
    '''
    更新特定使用者的排程資料
    '''
    return convert_collection(db('task')['schedule'].find())   
def delete_schedule(user_id,data_id):
    '''
    刪除使用者的排程資料
    '''
    return convert_collection(db('task')['schedule'].find())          