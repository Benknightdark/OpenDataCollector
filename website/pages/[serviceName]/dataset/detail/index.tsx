import { useRouter } from "next/router"

export default function Index(){
    const router = useRouter()
    const { serviceName, queryUrl } = router.query

    return <div>{queryUrl}</div>
}