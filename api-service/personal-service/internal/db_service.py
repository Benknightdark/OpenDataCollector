from pymongo import MongoClient
import os
from bson import json_util
import json
from bson.objectid import ObjectId
from . import secret_service
def convert_collection(data):
    '''
    轉換Collection資料形態
    '''
    return json.loads(json_util.dumps(data))
async def db(db_name):
    '''
    取得MongoDB 資料庫
    '''
    if os.getenv('ENVIRONMENT') == 'production':
        if os.getenv('MONGODB'):
            db_uri =os.getenv('MONGODB')
        else:
            db_uri = (await secret_service.get_jwt_config())['mongodb']
    else:
        db_uri = ('mongodb://root:example@localhost:1769/')    
    db_client = MongoClient(db_uri)
    return db_client[db_name]  
async def user_query(object_id):
    '''
    查詢使用者資料
    '''
    collection=await db('account')
    return convert_collection(collection['user'].find_one({'_id': ObjectId(object_id)}))