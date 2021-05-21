// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../helpers/common_helper";

const deleteFileDownload = async (id, token) => {
    const delFielDownloadReq = await fetch(`${getApiUrl("file-download-service")}/scheduler/jobs/${id}`, {
        method: 'DELETE', headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    })
    const delFileDownloadRes = await delFielDownloadReq.text();
    return delFileDownloadRes;
}

const deleteTask = async (id, token) => {
    const delFielDownloadReq = await fetch(`${getApiUrl("task-service")}/api/schedule/${id}`, {
        method: 'DELETE', headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    })
    const delFileDownloadRes = await delFielDownloadReq.text();
    return delFileDownloadRes;
}
export default async (req, res) => {
    try {
        const session = await getSession({ req })
        const deleteTaskRes=await deleteTask(req.query['id'], session.user.token);
        console.log(deleteTaskRes);
        const deleteRes = await deleteFileDownload(req.query['id'], session.user.token);
        console.log(deleteRes)
        res.status(200).json({ status: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: false, error: error })
    }
}




