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
    const fetchDataSetData = dataSetData(serviceName, queryUrl);
    console.log(fetchDataSetData.data)
    return <div>
        <CustomHeader goBack='true' />
        <div className="alert alert-warning" role="alert">
        <h3>{fetchDataSetData.data?.title}</h3></div>
        {
            fetchDataSetData.data && <div className="d-flex mb-3 p-2 bd-highlight flex-wrap justify-content-start align-content-stretch">
                {

                    fetchDataSetData.data.data.map(d => {
                        return (
                            <div className='p-2' key={d.name}>
                                <div className="card">
                                    <div className="card-header">
                                        {d.name}
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{d.content}</p>

                                    </div>
                                    <div className="card-footer d-flex   bd-highlight flex-wrap align-content-stretch">
                                        {
                                            d.data_type && (
                                                d.data_type.map(dt => {
                                                    return  <div className='px-1'> 
                                                        <span className='label' data-format={dt.toLowerCase()}>{dt}</span> 
                                                    </div>                                           
                                                })
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        }
    </div>
}