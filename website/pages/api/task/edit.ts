// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../helpers/common_helper";
const updateTaskData = async (data, token) => {
    const url = `${getApiUrl("task-service")}/api/schedule/${data['_id']['$oid']}`;
    const reqData = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        }),
    })
    const resData = await reqData.json()
    return resData;
}
const deleteFileDownload = async (data, token) => {
    const delFielDownloadReq = await fetch(`${getApiUrl("file-download-service")}/scheduler/jobs/${data['_id']['$oid']}`, {
        method: 'DELETE', headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    })
    const delFileDownloadRes = await delFielDownloadReq.text();
    return delFileDownloadRes;
}
const AddFileDownload = async (data, session) => {
    const reqData2 = await fetch(`${getApiUrl("file-download-service")}/scheduler/jobs`, {
        method: 'POST',
        body: JSON.stringify({
            id: data['_id']['$oid'],
            name: data['_id']['$oid'],
            func: "__main__:download",
            args: [
                data['url'],
                data['type'],
                data['name'],
                session.user.id,
                data['_id']['$oid']
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
export default async (req, res) => {
    try {
        const session = await getSession({ req })
        const data = JSON.parse(req.body);
        const updateTaskDataRes = await updateTaskData(data, session.user.token);
        const deleteRes = await deleteFileDownload(data, session.user.token);
        const resData2 = await AddFileDownload(data, session);
        res.status(200).json({status:true})
    } catch (error) {
        console.error(error)
        res.status(500).json({ status:false,error:error })
    }
}




