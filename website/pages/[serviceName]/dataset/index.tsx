import { useRouter } from "next/router"
import Spinner from '../../components/spinner'

import { useSWRInfinite } from "swr"
import React, { useEffect, useState } from "react"
import Layout from "../../components/layout"
export default function Index() {
    const router = useRouter()
    const fetcher = url => fetch(url).then(r => r.json())
    const [showLoading, setShowLoading] = useState(false);
    const { serviceName, queryUrl,target,org,group } = router.query
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null
        let otherQueryString=target===null?'':`&target=${target}&org=${org}&group=${group}`
        const url = `/api/dataset?serviceName=${serviceName}&pageUrl=${queryUrl}&page=${pageIndex + 1}${otherQueryString}`;
        return url
    }
    const { data, size, setSize } = useSWRInfinite(getKey, fetcher)
    useEffect(() => {
        window.onscroll = async () => {
            if (showLoading) return;
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
    return (        



        <div className="d-flex flex-column mb-3 bd-highlight flex-wrap justify-content-start align-content-stretch">
            {
                data.map((lists, index) => {
                    return lists.map(d => <div className='p-2  animate__animated  animate__zoomInLeft' key={d.name}>
                        <div className="card" onClick={() => {
                                    console.log(d.url)
                                    router.push({
                                        pathname: `/${serviceName}/dataset/detail`,
                                        query: { queryUrl: d.url },
                                    })
                                }}>
                            <div className="card-header">
                            <div className="d-flex justify-content-between">
                                <div>{d.name}</div>
                                <div style={{ flex: "1 1 auto;" }}></div>
                                <span className="material-icons" style={{ cursor: 'pointer' }} >open_in_new</span>
                                </div>
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
                    <Spinner showLoading={showLoading}></Spinner>

        </div>


    )

}