from pymongo import MongoClient
import os
from bson import json_util
import json
from bson.objectid import ObjectId
import datetime


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
            db_uri = os.getenv('MONGODB')
        else:
            db_uri = ('mongodb://root:example@mongo/')
    else:
        db_uri = ('mongodb://root:example@localhost:1769/')
    db_client = MongoClient(db_uri)
    return db_client[db_name]


def schedule_query_by_userid(user_id):
    '''
    查詢特定使用者的排程資料
    '''
    return convert_collection(db('task')['schedule'].find_one({'userId': user_id}))


def schedule_query():
    '''
    查詢所有使用者的排程資料
    '''
    return convert_collection(db('task')['schedule'].find())


def add_schedule(user_id, data):
    '''
    新增特定使用者的排程資料
    '''
    exist_data = schedule_query_by_userid(user_id)
    data['_id'] = ObjectId()
    if exist_data == None:
        insert_data = db('task')['schedule'].insert_one({
            "userId": user_id,
            "data": [
                data
            ]
        })
        return convert_collection(data)

    else:
        update_data = db('task')['schedule'].update_one(
            {"userId": user_id}, {'$push': {'data': data}}, True)
        return convert_collection(data)


def update_schedule(data_id, data):
    '''
    更新特定使用者的排程資料
    '''
    data['_id'] = ObjectId(data_id)
    update_data = db('task')['schedule'].update_one(
        {'data': {'$elemMatch': {'_id': ObjectId(data_id)}}}, {'$set': {"data.$": data}})
    return update_data.raw_result


def delete_schedule(data_id):
    '''
    刪除使用者的排程資料
    '''
    delete_data = db('task')['schedule'].update_one(
        {'data': {'$elemMatch': {'_id': ObjectId(data_id)}}},
        {'$pull': {'data': {"_id": ObjectId(data_id)}}}, True)
    return delete_data.upserted_id


def history_query(user_id, schedule_id):
    history_data = db('task')['history'].find_one(
        {"userId": user_id, "scheduleId": schedule_id},{"userId":1})
    return convert_collection(history_data)


def add_history(user_id, schedule_id, origin_data):
    inesert_data = db('task')['history'].insert_one({
        "userId": user_id,
        "scheduleId": schedule_id,
        "data": [
            {
                "createdTime": datetime.datetime.now(),
                "record": origin_data
            }
        ]
    })
    return inesert_data.inserted_id


def update_history(user_id, schedule_id, origin_data):
    update_data = db('task')['history'].update_one({"userId": user_id, "scheduleId": schedule_id}, {
        '$push': {
            'data': {
                "createdTime": datetime.datetime.now(),
                "record": origin_data
            }
        }
    },
        True)
    return update_data.raw_result
