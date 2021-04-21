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
def user_query(object_id):
    '''
    查詢使用者資料
    '''
    return convert_collection(db('account')['user'].find_one({'_id': ObjectId(object_id)}))