import { useRouter } from "next/router";
import { useSWRInfinite } from "swr";
import Spinner from "../../components/spinner";
import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    }

  }),
);
export default function Type() {
  const router = useRouter();
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const [showLoading, setShowLoading] = useState(false);

  const { serviceName, type } = router.query;
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;
    const url = `/api/category?serviceName=${serviceName}&dataType=${type}&page=${pageIndex + 1
      }`;
    console.log(url);
    return url;
  };
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);
  const classes = useStyles();

  useEffect(() => {
    if (serviceName.toString().toLowerCase() !== 'pthg-service') {
      window.onscroll = async () => {
        if (showLoading) return;

        if (
          window.innerHeight + window.scrollY - document.body.offsetHeight == 0
        ) {
          setShowLoading(true);
          setSize(size + 1)
            .then((c) => {
              setShowLoading(false);
            })
            .catch((c) => {
              setShowLoading(false);
            });
        }
      };
    }

  });
  if (!data) return <Spinner showLoading="true"></Spinner>;
  return (
    <div className={classes.root}>
      <Grid container
        justify="flex-start"
        alignItems="baseline"
        direction="row"
      >
        {data.map((lists, index) => {
          return lists.map((d) => (
            <Grid item xs={12} sm={12} xl={2} md={2} lg={2}
              className="animate__animated  animate__zoomIn"
              key={d.name}
            >
              <Card>
                <CardActionArea>
                  <CardMedia
                  component="img"
                    style={{ maxWidth: "100%", height: "auto" }}
                    image={d.image}
                  />
                  <CardContent>
                    <h5 className="card-title">{d.title}</h5>
                    {d.count > 0 && (
                      <div className="skillbar clearfix ">
                        <div className="skillbar-title">
                          <span>資料數量</span>
                        </div>
                        <div className="skillbar-bar"></div>
                        <div className="skill-bar-percent">{d.count}</div>
                      </div>
                    )}
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button
                    variant="contained" color="primary"
                    onClick={() => {
                      if (serviceName !== 'pthg-service') {
                        router.push({
                          pathname: `/${serviceName}/dataset`,
                          query: { queryUrl: d.url },
                        });
                      } else {
                        const queryData = { target: d.url, org: '', group: '' }
                        if (type == 'group') {
                          queryData.group = d.title
                        } else {
                          queryData.org = d.title

                        }
                        router.push({
                          pathname: `/${serviceName}/dataset`,
                          query: queryData,
                        });
                      }
                    }}
                  >
                    <OpenInNewIcon />看更多
                  </Button>
                </CardActions>
              </Card> 
            </Grid>
          ));
        })}
      </Grid>
      <Spinner showLoading={showLoading}></Spinner>

    </div>

  );
}
