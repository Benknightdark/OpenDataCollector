
export const getApiUrl=( apiName:string='')=>{
   const url=process.env.API_URL!==undefined?`http://localhost:3500/v1.0/invoke/api-gateway-service/method/${apiName}`:`http://localhost:5202/${apiName.toLowerCase()}`

   // ${process.env.API_URL}/invoke/${apiName}/method`
   return  url
}