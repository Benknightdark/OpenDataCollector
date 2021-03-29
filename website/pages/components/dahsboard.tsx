
import useSWR from "swr";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = (rawData) => {
    const seriesData = rawData.map(a => {
        return { name: a.name, y: a.count }
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

    return (
        <div className="card text-white bg-success">
            <div className="card-header">
                {fetchDashboardData.data?.title}  </div>
            <div className="card-body">
                <div className="d-flex p-2 bd-highlight flex-wrap justify-content-center">
                    {
                        fetchDashboardData.data && fetchDashboardData.data.items.map(d => {
                            return (<div className="p-3 bd-highlight" key={d.name} style={{ borderRight: '1px solid grey' }}>
                                <h3 className="text-center">
                                    <div className="badge rounded-pill bg-primary ">{d.name}</div> </h3>
                                <h4>
                                    <div className="animate__animated animate__flipInX text-center">{d.count}</div>
                                </h4>
                                <div className='text-center'>
                                    <a href="#" className="btn btn-warning">
                                    看更多<span className="material-icons" style={{ fontSize:'18px' }}>open_in_new</span></a>
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
