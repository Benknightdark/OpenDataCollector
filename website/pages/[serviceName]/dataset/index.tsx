import { useRouter } from "next/router"
import CustomHeader from '../../components/custom-header'
import Spinner from '../../components/spinner'

import  { useSWRInfinite } from "swr"
import { useEffect, useState } from "react"
export default function Index() {
    const router = useRouter()
    const fetcher = url => fetch(url).then(r => r.json())
    const [showLoading, setShowLoading] = useState(false);
    const { serviceName, queryUrl } = router.query
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null
        const url =`/api/dataset?serviceName=${serviceName}&pageUrl=${queryUrl}&page=${pageIndex + 1}`;
        console.log(url)
        return url
    }
    const { data, size, setSize } = useSWRInfinite(getKey, fetcher,)
    // useEffect(() => {
    //     window.onscroll = async () => {
    //         console.log((window.innerHeight + window.scrollY) - document.body.offsetHeight > 0)
    //         if ((window.innerHeight + window.scrollY) - document.body.offsetHeight > 0) {
    //             setShowLoading(true)
                
    //             setSize(size + 1).then(c => {
    //                 setShowLoading(false)
    //             }).catch(c => {
    //                 setShowLoading(false)
    //             })
    //         }
    //     };
    // })
    if (!data) return <Spinner showLoading='true'></Spinner>
    return <div>
        <CustomHeader goBack='true' />
        <div className="alert alert-warning" role="alert">
            <h3>{data[0]?.title}</h3></div>
        {
            <div className="d-flex  flex-column mb-3 p-2 bd-highlight flex-wrap justify-content-start align-content-stretch">
                {
                    data.map((lists, index) => {
                        return lists.data.map(d => {
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
                                                        return (<div className='px-1'>
                                                            <span className='label' data-format={dt.toLowerCase()}>{dt}</span>
                                                        </div>)
                                                    })
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })

                    })
                }
            </div>
        }
        <button onClick={async ()=>{
          setShowLoading(true)
                
          await setSize(size + 1)
          setShowLoading(false)

        }}>show fucking more</button>
        <Spinner showLoading={showLoading}></Spinner>
    </div>
}