// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../helpers/common_helper"

export default async (req, res) => {
  const pageUrl=`?q=${req.query['pageUrl']}?page=${req.query['page']}`
  const url=`${getApiUrl(req.query['serviceName'])}/api/dataset${pageUrl}`;
  console.log(url)
  const reqData=await fetch(url)
  const resData=await reqData.json()
  res.status(200).json(resData['data'])
  }
  