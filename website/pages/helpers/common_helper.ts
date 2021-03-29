import { env } from "node:process"

export const getEnvUrl=( apiName:string='')=>{
   return  process.env.ENVIRONMENT==='Production'?process.env.API_URL:
}