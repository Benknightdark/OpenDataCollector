// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../../helpers/common_helper";
import * as _ from 'lodash';

export default async (req, res) => {
    try {
        const session = await getSession({ req })
        const url = `${getApiUrl("task-service")}/api/download/history/${req.query['id']}`;
        const reqData = await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + session.user['token'], 
                'content-type': 'application/json'
            }),
        })
        const resData = await reqData.json()
        const sortedData=_.sortBy(resData[0]['data'], [function(o) { return o.id; }]).reverse();;
        console.log(sortedData)
        resData[0]['data']=sortedData;
        res.status(200).json(resData)
    } catch (error) {
        res.status(500).json({ error: error })
    }

}


