// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getEnvUrl } from "../../helpers/common_helper"

export default async (req, res) => {
  const reqData=await fetch(getEnvUrl('kao_service'))
  const resData=await reqData.json()
  res.status(200).json(resData)
  //res.status(200).json({ name: 'kao dashboard' })
  }
  