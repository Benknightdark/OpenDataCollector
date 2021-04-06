// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../../helpers/common_helper"

export default async (req, res) => {
  let url=''
  let pageUrl=''
  console.log(req.query)
  if(req.query['pageUrl']!=='undefined'){
    pageUrl=`?q=${req.query['pageUrl']}?page=${req.query['page']}`
  }else{
    let org=req.query['org']===''?'':encodeURI(req.query['org'])
    let group=req.query['group']===''?'':encodeURI(req.query['group'])

    pageUrl=`?target=${req.query['target']}&page=${req.query['page']}&org=${org}&group=${group}`

  }
  url=`${getApiUrl(req.query['serviceName'])}/api/dataset${pageUrl}`;
  console.log(url)
  const reqData=await fetch(url)
  const resData=await reqData.json()
  res.status(200).json(resData['data'])
  }
  