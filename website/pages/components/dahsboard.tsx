
import useSWR from "swr";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const options: Highcharts.Options = {
    title: {
        text: 'My chart'
    },
    series: [{
        type: 'line',
        data: [1, 2, 3]
    }]
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
        <div className="card">
            <div className="card-header">
                {fetchDashboardData.data?.title}  </div>
            <div className="card-body">
                <div className="d-flex p-2 bd-highlight flex-wrap">
                    {
                        fetchDashboardData.data && fetchDashboardData.data.items.map(d => {
                            return <div className="p-3 bd-highlight" key={d.name}>
                                <h3>{d.name}</h3>
                                <h4>{d.count}筆</h4>
                            </div>
                        })


                    }


                </div>
                <div className="d-flex flex-row">
                    {
                        fetchDashboardData.data &&
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                            {...props}
                        />
                    }
                </div>

            </div>
        </div>

    )
}
