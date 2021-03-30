
export const getApiUrl=( apiName:string='')=>{
   console.log(apiName)
   const url=process.env.API_URL!==undefined?`${process.env.API_URL}/invoke/${apiName}/method`:`http://localhost:${process.env[apiName.toUpperCase()]}`
   return  url
}