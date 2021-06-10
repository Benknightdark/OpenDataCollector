// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../helpers/common_helper"

export default async (req, res) => {
    const url = `${getApiUrl("personal-service")}/api/user-info`;
    const session = await getSession({ req })
    if (session == null) {
        res.status(401).json({ "message": "Session過時" })
    } else {
        console.log(session.user.token)
        const reqData = await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + session.user.token,
            }),
        })
        console.log(reqData.status)
        const resData = await reqData.json()
        res.status(200).json({ displayName: resData['displayName'] })
    }

}
