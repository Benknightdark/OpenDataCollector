import { useRouter } from "next/router"
import Spinner from '../../components/spinner'
import useSWRInfinite from 'swr/infinite'
import React, { useEffect, useState } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from '@material-ui/core/CardHeader';
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: theme.spacing(2),
        }

    }),
);
export default function Index() {
    const classes = useStyles();

    const router = useRouter()
    const fetcher = url => fetch(url).then(r => r.json())
    const [showLoading, setShowLoading] = useState(false);
    const { serviceName, queryUrl, target, org, group } = router.query
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null
        let otherQueryString = target === null ? '' : `&target=${target}&org=${org}&group=${group}`
        const url = `/api/dataset?serviceName=${serviceName}&pageUrl=${queryUrl}&page=${pageIndex + 1}${otherQueryString}`;
        return url
    }
    const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(getKey, fetcher);
    useEffect(() => {
        window.onscroll = async () => {
            if (showLoading) return;
            if ((window.innerHeight + window.scrollY) - document.body.offsetHeight === 0) {
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
        <div className={classes.root}>
            <Grid container spacing={3}>
                {
                    data.map((lists, index) => {
                        return lists.map(d => <Grid item xs={12} key={d.name}>
                            <Card className="card" onClick={() => {
                                router.push({
                                    pathname: `/${serviceName}/dataset/detail`,
                                    query: { queryUrl: d.url },
                                })
                            }}>
                                <CardHeader
                                    action={
                                        <IconButton aria-label="settings">
                                            <OpenInNewIcon />
                                        </IconButton>
                                    }
                                    title={d.name}
                                />
                                <Divider light  variant="middle" style={{backgroundColor:"black"}}></Divider>
                                <CardContent>
                                    <Typography paragraph>{d.content}</Typography>
                                </CardContent>
                                <CardActions>
                                    {
                                        d.data_type.map(dt =>
                                            <span className='label' data-format={dt.toLowerCase()}>{dt}</span>
                                        )
                                    }
                                </CardActions>
                            </Card>
                        </Grid>
                        )
                    })
                }
                <Spinner showLoading={showLoading}></Spinner>
            </Grid>
        </div>

    )
}