// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../helpers/common_helper"

export default async (req, res) => {
  //dashboard
  //group
  //org
  console.log(req.query)
  // const isGetDetailData=req.query['detail']===null?'':'/detail'
console.log('-000000000000000000000000000000000000000')
  const pageUrl=`?q=${req.query['pageUrl']}`
  const url=`${getApiUrl(req.query['serviceName'])}/api/dataset${pageUrl}`;
  console.log(url)
  const reqData=await fetch(url)
  const resData=await reqData.json()
  res.status(200).json(resData)
  }
  