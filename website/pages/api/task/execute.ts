// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../helpers/common_helper";

export default async (req, res) => {
    try {
        const session = await getSession({ req })
        const url = `${getApiUrl("file-download-service")}/scheduler/jobs/${req.query['id']}/run`;
        const reqData = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + session.user.token,            'content-type': 'application/json'

            }),
        })
        const resData = await reqData.json()
        res.status(200).json(resData)
    } catch (error) {
        res.status(500).json({ error: error })

    }

}


