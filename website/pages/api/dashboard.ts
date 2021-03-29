// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../helpers/common_helper"

export default async (req, res) => {
  //dashboard
  //group
  //org
  console.log(req.query)
  const reqData=await fetch(`${getApiUrl(req.query['serviceName'])}/api/${req.query['dataType']}`)
  const resData=await reqData.json()
  res.status(200).json(resData)
  }
  