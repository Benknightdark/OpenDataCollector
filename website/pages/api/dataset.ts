// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../helpers/common_helper"

export default async (req, res) => {
  //dashboard
  //group
  //org
  const isGetDetailData=req.query['detail']===null?'':'/detail'
  const pageUrl=`?q=${req.query['pageUrl']}`
  const reqData=await fetch(`${getApiUrl(req.query['serviceName'])}/api/dataset${isGetDetailData}${pageUrl}`)
  const resData=await reqData.json()
  res.status(200).json(resData)
  }
  