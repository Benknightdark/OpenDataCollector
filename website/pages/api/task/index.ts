// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { getApiUrl } from "../../../helpers/common_helper";

export default async (req, res) => {
    const session = await getSession({ req })
    const reqData = await fetch(`${getApiUrl("task-service")}/api/schedule/${session.user.id}`, {
        headers: new Headers({
            'Authorization': 'Bearer ' + session.user.token,
        }),
    })
    const resData = await reqData.json()
    res.status(200).json(resData['data'])
}


