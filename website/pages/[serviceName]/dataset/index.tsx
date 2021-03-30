import { useRouter } from "next/router"
import CustomHeader from '../../components/custom-header'

import useSWR from "swr"
const dataSetData = (serviceName: string | string[], pageUrl: string | string[]) => {
    const { data, error, isValidating, mutate } = useSWR(
        `/api/dataset?serviceName=${serviceName}&pageUrl=${pageUrl}`,
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
    const fetchDashboardData = dataSetData(serviceName, queryUrl);
    console.log(fetchDashboardData.data)
    return <div>            
        <CustomHeader goBack='true' />
    </div>
}