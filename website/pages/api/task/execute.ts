// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../helpers/common_helper";

export default async (req, res) => {
    const session = await getSession({ req })
    const url=`${getApiUrl("file-download-service")}/scheduler/jobs/${req.query['id']}/run`;
    console.log(url)
    const reqData = await fetch(url, {
        method:'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + session.user.token,
        }),
    })
    const resData = await reqData.json()
    res.status(200).json(resData)
}


