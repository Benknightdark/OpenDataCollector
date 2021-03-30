
export const getApiUrl=( apiName:string='')=>{
   const url=process.env.API_URL!==undefined?`${process.env.API_URL}/invoke/${apiName}/method`:`http://localhost:${process.env[apiName.toUpperCase()]}`
   console.log('root url => ',url)
   return  url
}