import CustomHeader from '../../components/custom-header'
import { useRouter } from "next/router"
import useSWR, { useSWRInfinite } from 'swr'
import { useState } from 'react'
import { useEffect } from 'react'




export default function Type() {
    const router = useRouter()
    const fetcher = url => fetch(url).then(r => r.json())
    const { serviceName, type } = router.query
    // const [pageIndex, setPageIndex] = useState(1);
    // const dashboardData = (serviceName: string | string[], type: string | string[]) => {
    //     const { data, error, isValidating, mutate } = useSWR(
    //         `/api/dashboard?serviceName=${serviceName}&dataType=${type}&page=${pageIndex}`,
    //         fetcher,
    //         {
    //             refreshInterval: 60000
    //         })
    //     return { data, error, isValidating, mutate }
    // }
    // const fetchDashboardData = dashboardData(serviceName, type);
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null
        if (pageIndex === 0) return `/api/dashboard?serviceName=${serviceName}&dataType=${type}&page=1`

        // reached the end
        return `/api/dashboard?serviceName=${serviceName}&dataType=${type}&page=${pageIndex}`

        //`/users?page=${pageIndex}&limit=10`                    // SWR key
    }
    const { data, size, setSize } = useSWRInfinite(getKey, fetcher,)
    console.log(data)
    if (!data) return 'loading';


    // useEffect(() => {
    //     window.onscroll = async () => {
    //       console.log((window.innerHeight + window.scrollY) - document.body.offsetHeight )
    //       if ((window.innerHeight + window.scrollY) - document.body.offsetHeight >0) {
    //         setSize(size + 1)
    //       }
    //     };
    //   })
    return (

        <div>
            <CustomHeader goBack='true' />
            <div className="d-flex mb-3 p-2 bd-highlight flex-wrap justify-content-startalign-content-stretch">
                {

                    data.map((lists, index) => {
                        return lists.map(d => <div className='p-2' key={d.name}>
                            <div className="card mb-3 p-2" style={{ width: '300px' }}>
                                <img src={d.image} className="card-img-top" style={{ maxWidth: '100%', height: 'auto' }} />
                                <hr></hr>
                                <div className="card-body">
                                    <h5 className="card-title">{d.title}</h5>
                                    {
                                        d.count > 0 && <div className="skillbar clearfix ">
                                            <div className="skillbar-title">
                                                <span>資料數量</span>
                                            </div>
                                            <div className="skillbar-bar"></div>
                                            <div className="skill-bar-percent">{d.count}</div>
                                        </div>
                                    }
                                    <button className="btn btn-warning"
                                        onClick={() => {
                                            router.push(
                                                {
                                                    pathname: `/${serviceName}/dataset`,
                                                    query: { queryUrl: d.url },
                                                }
                                            )
                                        }}
                                    >
                                        看更多<span className="material-icons" style={{ fontSize: '18px' }}>open_in_new</span>
                                    </button>
                                </div>
                            </div>
                        </div>)
                    })



                }
                <button onClick={() => setSize(size + 1)}>Load More</button>
            </div>
        </div>
    )
}
