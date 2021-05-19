// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../helpers/common_helper";
const addFileDownloadData = async (inertID,data, session) => {
    const reqData2 = await fetch(`${getApiUrl("file-download-service")}/scheduler/jobs`, {
        method: 'POST',
        body: JSON.stringify({
            id: inertID,
            name: inertID,
            func: "__main__:download",
            args: [
                data['url'],
                data['type'],
                data['name'],
                session.user.id,
                inertID
            ],
            kwargs: {},
            trigger: "cron",
            hour: data['executeTime'].split(':')[0],
            minute: data['executeTime'].split(':')[1]
        }),
        headers: new Headers({
            'Authorization': 'Bearer ' + session.user.token,
        }),
    })
    const resData2 = await reqData2.json()
    return resData2;
}
const addTaskData = async (data, session) => {
    const url = `${getApiUrl("task-service")}/api/schedule/${session.user.id}`;
    const reqData = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Authorization': 'Bearer ' + session.user.token,
        }),
    })
    const resData = await reqData.text()
    return resData;
}
export default async (req, res) => {
    try {
        const session = await getSession({ req })
        const data = JSON.parse(req.body);
        const inertID=await addTaskData(data,session);
        const addFileDownloadDataaRes = await addFileDownloadData(inertID,data, session);
        res.status(200).json({status:true})
    } catch (error) {
        console.error(error)
        res.status(500).json({ status:false,error:error })
    }
}




