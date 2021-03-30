// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getApiUrl } from "../../helpers/common_helper"

export default async (req, res) => {
  //dashboard
  //group
  //org
  console.log(req.query)
  const url =`${getApiUrl(req.query['serviceName'])}/api/${req.query['dataType']}${req.query['page']==null?'':'?page='+req.query['page']}`;
  console.log(url)
  const reqData = await fetch(url)
  const resData = await reqData.json()
  if (req.query['dataType'] === 'dashboard') {
    for (const item of resData.items) {
      switch (item['name']) {
        case '資料集':
        case '資料':
          item['route'] = 'dataset'
          break;
        case '組織':
          item['route'] = 'category/org'
          break;
        case '主題':
        case '群組':
          item['route'] = 'category/group'
          break;
        default:
          item['route'] = ''
          break;
      }
    }
  }
  res.status(200).json(resData)
}
