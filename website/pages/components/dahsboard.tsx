
import useSWR from "swr";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import randomColor from "randomcolor";
import { useRouter } from 'next/router';
const options = (rawData) => {
    const seriesData = rawData.map(a => {
        return { name: a.name, y: a.count,color:randomColor() }
    });
    return {
        title: {
            text: ''
        },
        chart: {
            type: 'pie'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },

        series: [{
            name: '資料數量',
            colorByPoint: true,
            data: seriesData
        }],
        credits: {
            enabled: false
        }
    }
}
const dashboardData = (serviceName: string) => {
    const { data, error, isValidating, mutate } = useSWR(
        `/api/dashboard?serviceName=${serviceName}&dataType=dashboard`,
        fetcher,
        {
            refreshInterval: 60000
        })
    return { data, error, isValidating, mutate }
}
const fetcher = url => fetch(url).then(r => r.json())
export default function Dashboard(props) {
    const fetchDashboardData = dashboardData(props.serviceName);
    const router = useRouter()

    return (
        <div className="card bg-light">
            <div className="card-header">
               {
                   fetchDashboardData.data?( <div className="d-flex justify-content-between">
                   <div>🟢 {fetchDashboardData.data?.title}</div>
                   <div style={{ flex: "1 1 auto;" }}></div>
                   <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => {
                       fetchDashboardData.mutate()
                   }}>refresh</span>
           </div>):(<div className="d-flex justify-content-between"> <div>🔴 資料載入中......</div></div>)
               }
            </div>

            <div className="card-body">
                <div className="d-flex p-2 bd-highlight flex-wrap justify-content-center">
                    {
                        fetchDashboardData.data && fetchDashboardData.data.items.map(d => {
                            return (d.name!=='應用展示'&&<div className="p-3 bd-highlight" key={d.name} style={{ borderRight: '1px solid white' }}>
                                <h3 className="text-center">
                                    <div className="badge rounded-pill bg-primary ">{d.name}</div> </h3>
                                <h4>
                                    <div className="animate__animated animate__flipInX text-center">{d.count}</div>
                                </h4>
                                <div className='text-center'>
                                    <button className="btn btn-warning" onClick={()=>{
                                        router.push(`/${props.serviceName}/${d.route}`);
                                    }}>
                                        看更多<span className="material-icons" style={{ fontSize: '18px' }}>open_in_new</span>
                                        </button>
                                </div>
                            </div>)
                        })
                    }
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                    {
                        fetchDashboardData.data &&
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options(fetchDashboardData.data.items)}
                            {...props}
                        />
                    }
                </div>

            </div>
        </div>

    )
}
