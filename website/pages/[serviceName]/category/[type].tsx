import CustomHeader from '../../components/custom-header'
import { useRouter } from "next/router"
import useSWR from 'swr'

const dashboardData = (serviceName: string | string[], type: string | string[],page:number) => {
    const { data, error, isValidating, mutate } = useSWR(
        `/api/dashboard?serviceName=${serviceName}&dataType=${type}&page=${page}`,
        fetcher,
        {
            refreshInterval: 60000
        })
    return { data, error, isValidating, mutate }
}
const fetcher = url => fetch(url).then(r => r.json())

export default function Type() {
    const router = useRouter()
    const { serviceName, type } = router.query
    const fetchDashboardData = dashboardData(serviceName, type,1);
    return (

        <div>
            <CustomHeader goBack='true' />
            {
                fetchDashboardData.data && <div className="d-flex mb-3 p-2 bd-highlight flex-wrap justify-content-startalign-content-stretch">
                    {

                        fetchDashboardData.data.map(d => {
                            return (
                                <div className='p-2'>
                                    <div className="card mb-3 p-2" style={{width:'300px'}}>
                                        <img src={d.image} className="card-img-top" style={{maxWidth:'100%',height:'auto'}}/>
                                        <hr></hr>
                                        <div className="card-body">
                                            <h5 className="card-title">{d.title}</h5>
                                            {
                                                d.count>0 && <div className="skillbar clearfix ">
                                                    <div className="skillbar-title">
                                                        <span>資料數量</span>
                                                    </div>
                                                    <div className="skillbar-bar"></div>
                                                    <div className="skill-bar-percent">{d.count}</div>
                                                </div>
                                            }
                                            <button className="btn btn-warning">
                                                看更多<span className="material-icons" style={{ fontSize: '18px' }}>open_in_new</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}
