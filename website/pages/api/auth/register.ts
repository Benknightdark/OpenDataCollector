// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../../helpers/common_helper";


export default async (req, res) => {
  
  const url =`${getApiUrl(req.query['serviceName'])}/api/${req.query['dataType']}${req.query['page']==null?'':'?page='+req.query['page']}`;
  const reqData = await fetch(url)
  const resData = await reqData.json()
  res.status(200).json(resData)
}
