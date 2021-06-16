// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../helpers/common_helper"

export default async (req, res) => {
    const url = `${getApiUrl("personal-service")}/api/user-info`;
    const session = await getSession({ req })
    if (session == null) {
        res.status(401).json({ "message": "Session過時" })
    } else {
        const reqData = await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + session.user['token'],
            }),
        })
        const statusCode = reqData.status;
        if (statusCode == 401) {
            res.status(401).json({ "message": "Session過時" })
        } else if (statusCode == 500) {
            const error = await reqData.text()
            res.status(500).json({ "message": error })
        }
        const resData = await reqData.json()
        res.status(200).json({ displayName: resData['displayName'] })
    }

}
