// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../helpers/common_helper";

export default async (req, res) => {
    try {
        const session = await getSession({ req })
        const reqData = await fetch(`${getApiUrl("task-service")}/api/schedule/${session.user['id']}`, {
            headers: new Headers({
                'Authorization': 'Bearer ' + session.user['token'], 'content-type': 'application/json'
            }),
        })
        const resData = await reqData.json()


        const reqData2 = await fetch(`${getApiUrl("task-service")}/api/summary/history/${session.user['id']}`, {
            headers: new Headers({
                'Authorization': 'Bearer ' + session.user['token'], 'content-type': 'application/json'
            }),
        })
        console.log(reqData2.status)
        const resData2 = await reqData2.json()
        console.log(resData2);
        const masterData = resData['data'];
        for (const item of masterData) {
            const filterItem = resData2.filter(a => a['scheduleId'] == item['_id']['$oid']);
            if (filterItem.length > 0) {
                item['count'] = filterItem[0]['dataCount']
            }
        }
        res.status(200).json(masterData)
    } catch (error) {
        console.error(error)
        res.status(500).json([])

    }

}


