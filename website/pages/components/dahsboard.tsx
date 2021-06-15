
import useSWR from "swr";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import randomColor from "randomcolor";
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import React from "react";
import { IconButton } from "@material-ui/core";
import Refresh from '@material-ui/icons/Refresh';
import BarChart from '@material-ui/icons/BarChart';
import Alert from "@material-ui/lab/Alert";
import Fab from '@material-ui/core/Fab';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: theme.spacing(2),
        },
        '& hr': {
            margin: theme.spacing(0, 0.5),
        },
    }),
);
const options = (rawData) => {
    const seriesData = rawData.map(a => {
        return { name: a.name, y: a.count, color: randomColor() }
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
        `/api/dashboard?serviceName=${serviceName}`,
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
    const classes = useStyles();

    return (
        <Grid item xs={12} lg={6} md={12} className={classes.root}>

            <Card className="card">
                <CardHeader
                className='gradient-yellow'
                    action={
                        <IconButton aria-label="重新整理" onClick={() => {
                            fetchDashboardData.mutate()
                        }}>
                            <Refresh />
                        </IconButton>
                    }
                    title={
                        fetchDashboardData.data ? (<div>
                            <div>🟢 {fetchDashboardData.data?.title}</div>

                        </div>) : (<div> <div>🔴 資料載入中......</div></div>)
                    }
                />
              
                <CardContent>
                    <Grid container spacing={1}
                        direction="row"
                        justify="center"
                        alignItems="center">
                        {
                            fetchDashboardData.data && fetchDashboardData.data.items.map(d => {
                                return (d.name !== '應用展示' && <Grid item
                                    key={d.name}>

                                    <Alert severity="success">{d.name}</Alert>


                                    <Alert className="animate__animated animate__flipInX text-center" icon={<BarChart fontSize="inherit" />} severity="info">
                                        {d.count}
                                    </Alert>
                                    <Fab
                                        variant="extended"
                                        size="small"
                                        color="secondary"
                                        aria-label="navigate"
                                        onClick={() => {
                                            router.push(`/${props.serviceName}/${d.route}`, undefined, { shallow: true });
                                        }}
                                    >
                                        <OpenInNewIcon />
                                        看更多
                                    </Fab>
                                </Grid>)
                            })
                        }
                    </Grid>
                    <Grid style={{paddingTop:10}}>
                        {
                            fetchDashboardData.data &&
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={options(fetchDashboardData.data.items)}
                                {...props}
                            />
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Grid>

    )
}
