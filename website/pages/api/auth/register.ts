// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../../helpers/common_helper";


export default async (req, res) => {
  console.log(req.body)
  const url =`${getApiUrl("account-service")}/api/register`
  const reqData = await fetch(url, { method: "POST", body: JSON.stringify(req.body), headers: { 'content-type': "application/json" } });
  console.log('----------------------------------------')
  const resData = await reqData.json()
  console.log(resData)
  res.status(200).json(resData)
}
