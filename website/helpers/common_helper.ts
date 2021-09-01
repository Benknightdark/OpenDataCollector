
export const getApiUrl=( apiName:string='')=>{
   const url=process.env.API_URL!==undefined?`${process.env.API_URL}/${apiName}`:`http://localhost:5202/${apiName.toLowerCase()}`

   // ${process.env.API_URL}/invoke/${apiName}/method`
   return  url
}

export const checkIsLogin=async ()=>{
   const req = await fetch("/api/personal");
   const resStatus=req.status;
   if(resStatus==200)
      window.history.back();
}


export const checkIsNotLogin=async ()=>{
   const req = await fetch("/api/personal");
   const resStatus=req.status;
   if(resStatus!=200)
      window.location.replace('/auth/signin');
}