// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../../helpers/common_helper";


export default async (req, res) => {
  const url =`${getApiUrl("account-service")}/api/register`
  const reqData = await fetch(url, { method: "POST", body: JSON.stringify(req.body), headers: { 'content-type': "application/json" } });
  const resData = await reqData.json()
  res.status(200).json(resData)
}
