from pymongo import MongoClient
import os
from bson import json_util
import json
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
        if os.getenv('MONGODB'):
            db_uri =os.getenv('MONGODB')
            print('================================')
            print(db_uri)
        else:
            db_uri =('mongodb://root:example@mongo/')
    else:
        db_uri =('mongodb://root:example@localhost:1769/')    
    db_client = MongoClient(db_uri)
    return db_client[db_name]
def user_create(data):
    '''
    新增使用者資料
    '''
    create_data=db('account')['user'].insert_one(data)
    return create_data    
def user_query(data):
    '''
    查詢使用者資料
    '''
    return convert_collection(db('account')['user'].find_one(data))    