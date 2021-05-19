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
        res.status(200).json(resData)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })

    }

}


