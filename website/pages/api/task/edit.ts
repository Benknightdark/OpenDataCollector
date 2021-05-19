// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../helpers/common_helper";

export default async (req, res) => {
    try {
        const session = await getSession({ req })
        const data = JSON.parse(req.body);
        console.log(data)
        const url = `${getApiUrl("task-service")}/api/schedule/${data['_id']['$oid']}`;
        const reqData = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers({
                'Authorization': 'Bearer ' + session.user.token,
            }),
        })
        const resData = await reqData.json()
        
        // session.user.id
        const fileDownloadServieUrl=`${getApiUrl("file-download-service")}/scheduler/jobs/${data['_id']['$oid']}`;
        const reqData2 = await fetch(fileDownloadServieUrl, {
            method:'PATCH',
            body:JSON.stringify({          
                    id: req.query['id'],
                    name: req.query['id'],
                    func: "__main__:download",
                    args: [
                        data['url'],
                        data['type'],
                        data['name'],
                        session.user.id,
                        req.query['id']
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
        console.log(await reqData2.text())
        const resData2 = await reqData2.json()
        res.status(200).json({
            'update':resData,
            'fileDownload':resData2
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })

    }

}


