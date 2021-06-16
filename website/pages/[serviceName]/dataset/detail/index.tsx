import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Spinner from "../../../components/spinner";
import { useEffect, useState } from "react";
import { EventEmitter } from "tsee";
import { makeStyles, createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import { CardHeader } from "@material-ui/core";
import { Box } from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { List } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";
import { ListItemIcon } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    table: {
      minWidth: 650,
    },

  }),
);
const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);
const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);
const detailData = (
  serviceName: string | string[],
  pageUrl: string | string[]
) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/api/dataset/detail?serviceName=${serviceName}&pageUrl=${pageUrl}`,
    fetcher,
    {
      refreshInterval: 60000,
    }
  );
  return { data, error, isValidating, mutate };
};
const fetcher = (url) => fetch(url).then((r) => r.json());
export default function Index() {
  const classes = useStyles();
  const router = useRouter();
  const { serviceName, queryUrl } = router.query;
  const fetchDetailData = detailData(serviceName, queryUrl);
  const events = new EventEmitter<{
    close: () => void,
  }>();
  events.on('close', async () => {
    await fetchDetailData.mutate();
  })
  useEffect(() => { });
  if (!fetchDetailData.data) return <Spinner showLoading="true"></Spinner>;
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* 標題 */}
        <Grid item xs={12} className="card">
          <Card variant="outlined">
            <CardHeader title={
              <h1>
                {fetchDetailData.data.title}
              </h1>
            } >
            </CardHeader>
          </Card>
        </Grid>
        {/* 統計資料 */}
        {fetchDetailData.data.statics.length > 0 && (
          <Grid container item xs={12} justify="center"
            alignItems="center" spacing={3}>
            {fetchDetailData.data.statics.map((s) => (
              <Grid item xs={12} sm={12} xl={2} md={2} lg={2}>
                <Card variant="outlined" className="card">
                  <CardHeader
                    title={
                      <div>
                        <h3 className="quote-text"> {s.name}</h3>
                        <hr></hr>
                      </div>
                    }
                    subheader={
                      <Box textAlign="center">
                        <h2> {s.value}</h2>
                      </Box>
                    }
                  >
                  </CardHeader>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {/* 資料說明 */}
        <Grid item xs={12} style={{ zIndex: 100000 }}>
          <Accordion defaultExpanded TransitionProps={{ unmountOnExit: false }} >
            <AccordionSummary className='gradient-pink'
              expandIcon={<ExpandMoreIcon />}
            ><h3>資料說明</h3>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead className='gradient-red'>
                    <TableRow>
                      <TableCell>名稱</TableCell>
                      <TableCell>值</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fetchDetailData.data.infomation.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell>{row.value}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <hr></hr>
        {/* 檔案下載 */}
        <Grid item xs={12} style={{ zIndex: 100000 }}>
          <Accordion defaultExpanded TransitionProps={{ unmountOnExit: false }} >
            <AccordionSummary className='gradient-blue'
              expandIcon={<ExpandMoreIcon />}
            ><h3>檔案下載</h3>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {fetchDetailData.data.resources.map((r) => (
                  <Grid item xs={12}>
                    <Card>
                      <List className="gradient-green">
                        <ListItem >
                          <ListItemText primary={r.name} />
                          <ListItemIcon>
                            <span
                              className="label"
                              data-format={r.type.toLowerCase()}
                            >
                              {r.type}
                            </span>
                          </ListItemIcon>

                        </ListItem>
                      </List>
                      <CardContent>
                        <blockquote>{r.description}</blockquote>

                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          style={{ color: 'white', backgroundColor: "purple" }}
                          onClick={() => {
                            const link = document.createElement("a");
                            link.download = "download";
                            link.target = "_blank";
                            link.href = r.downloadLink;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          下載
                          </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            window.open(r.detail);
                          }}
                        >
                          明細
                          </Button>
                        {
                          (r.type.toLowerCase() === 'xml' || r.type.toLowerCase() === 'json' || r.type.toLowerCase() === 'csv'
                            || r.type.toLowerCase() === 'xls' || r.type.toLowerCase() === 'xlsx'
                          ) && <Button

                            variant="contained" color="primary"
                            onClick={async () => {
                              try {
                                const personalDataReq = await fetch('/api/personal')
                                const status = personalDataReq.status;
                                if (status == 200) {
                                  console.log(r)
                                  router.push(`/${serviceName}/dataset/schedule?data=${JSON.stringify({
                                    executeTime: '',
                                    type: r.type,
                                    name: r.name,
                                    url: r.downloadLink,
                                    modalTitle: '新增',
                                    disable: false
                                  })}`)
                                } else {
                                  const resData = await personalDataReq.json();
                                  alert(resData['message'])
                                }
                              } catch (error) {
                                alert("登入後才能加入排程")
                              }
                            }}
                          >
                            加入排程
                          </Button>
                        }
                      </CardActions>
                    </Card>
                  </Grid>))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </div>
  );
}
