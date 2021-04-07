
export const getApiUrl=( apiName:string='')=>{
   const url=process.env.API_URL!==undefined?`${process.env.API_URL}/invoke/${apiName}/method`:`http://localhost:5202/${apiName.toLowerCase()}`
   //`http://localhost:${process.env[apiName.toUpperCase()]}`
   return  url
}