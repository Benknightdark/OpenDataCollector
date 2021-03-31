import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"
import CustomHeader from "../../../components/custom-header"
import Spinner from "../../../components/spinner"
const detailData = (serviceName: string | string[], pageUrl: string | string[]) => {
    const { data, error, isValidating, mutate } = useSWR(
        `/api/dataset/detail?serviceName=${serviceName}&pageUrl=${pageUrl}`,
        fetcher,
        {
            refreshInterval: 60000
        })
    return { data, error, isValidating, mutate }
}
const fetcher = url => fetch(url).then(r => r.json())
export default function Index() {
    const router = useRouter()
    const { serviceName, queryUrl } = router.query
    const fetchDetailData = detailData(serviceName, queryUrl)
    console.log(fetchDetailData.data)
    if (!fetchDetailData.data) return <Spinner showLoading='true'></Spinner>
    return <div>
        <CustomHeader goBack='true' />
        <div className="container-fluid px-1">

        <div className="d-flex flex-column  p-3 mb-3 bd-highlight flex-wrap justify-content-center">
            <div className="card  border-success bg-light">
                <div className="card-body">
                    <h1>                {fetchDetailData.data.title}
                    </h1>
                </div>
            </div>
            <div className="d-flex p-3 mb-3 bd-highlight flex-wrap justify-content-center">
                
            </div>

        </div>
        </div>
    </div>
}