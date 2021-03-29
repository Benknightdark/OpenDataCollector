
export const getEnvUrl=( apiName:string='')=>{
   return  process.env.ENVIRONMENT==='Production'?`${process.env.API_URL}/invoke/${apiName}/method`:`http://localhost:${process.env[apiName.toUpperCase()]}`
}