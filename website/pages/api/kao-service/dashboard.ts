// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../../helpers/common_helper"

export default async (req, res) => {
  const reqData=await fetch(getApiUrl('kao-service'))
  const resData=await reqData.text()
  res.status(200).json(resData)
  //res.status(200).json({ name: 'kao dashboard' })
  }
  