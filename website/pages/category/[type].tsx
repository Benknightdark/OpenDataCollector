import { useRouter } from "next/router"



export default function  Type ()  {
    const router = useRouter()
    const { type} = router.query
  
    return (
       <div>      <h1>Comment:{type}</h1>
       <span onClick={() => router.back()}>Click here to go back</span>
       </div>

    )
}
