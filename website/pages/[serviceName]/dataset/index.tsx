import { useRouter } from "next/router"
import CustomHeader from '../../components/custom-header'
import Spinner from '../../components/spinner'

import { useSWRInfinite } from "swr"
import { useEffect, useState } from "react"
export default function Index() {
    const router = useRouter()
    const fetcher = url => fetch(url).then(r => r.json())
    const [showLoading, setShowLoading] = useState(false);
    const [increasePage, setIncreasePage] = useState(1);
    const { serviceName, queryUrl } = router.query
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null
        const url = `/api/dataset?serviceName=${serviceName}&pageUrl=${queryUrl}&page=${pageIndex + 1}`;
        console.log(url)
        return url
    }
    const { data, size, setSize } = useSWRInfinite(getKey, fetcher)
    useEffect(() => {
        window.onscroll = async () => {
            console.log((window.innerHeight + window.scrollY) - document.body.offsetHeight > 0)
            if ((window.innerHeight + window.scrollY) - document.body.offsetHeight > 0) {
                setShowLoading(true)
                setSize(size + 1).then(() => {
                    setShowLoading(false)
                }).catch(() => {
                    setShowLoading(false)
                })
            }
        };
    })
    if (!data) return <Spinner showLoading='true'></Spinner>
    return (<div>
        <CustomHeader goBack='true' />
        {/* <div className="alert alert-warning" role="alert">
            <h3>{data[0]?.title}</h3></div> */}

        <div className="d-flex flex-column mb-3 bd-highlight flex-wrap justify-content-start align-content-stretch">
            {
                data.map((lists, index) => {
                    return lists.map(d => <div className='p-2' key={d.name}>
                        <div className="card">
                            <div className="card-header">
                                {d.name}
                            </div>
                            <div className="card-body">
                                <p className="card-text">{d.content}</p>

                            </div>
                            <div className="card-footer d-flex   bd-highlight flex-wrap align-content-stretch">
                                {

                                    d.data_type.map(dt =>
                                        <div className='px-1'>
                                            <span className='label' data-format={dt.toLowerCase()}>{dt}</span>
                                        </div>
                                    )

                                }
                            </div>
                        </div>
                    </div>

                    )

                })
            }
        </div>


        <Spinner showLoading={showLoading}></Spinner>
    </div>)

}