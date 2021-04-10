
export const getApiUrl=( apiName:string='')=>{
   const url=process.env.API_URL!==undefined?`${process.env.API_URL}/${apiName}`:`http://localhost:5202/${apiName.toLowerCase()}`

   // ${process.env.API_URL}/invoke/${apiName}/method`
   return  url
}