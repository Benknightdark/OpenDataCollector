import React, { useState } from "react";
import useSWR from "swr";
import Spinner from "../components/spinner";
import TaskForm from "../components/TaskForm";
import { EventEmitter } from "tsee";
import { useCustomSnackBar } from "../components/hooks/custom-snackbar-context";
import Assignment from "@material-ui/icons/Assignment";
import CloseOutLined from "@material-ui/icons/CloseOutlined";

import CloudDownload from "@material-ui/icons/CloudDownload";
import Fab from "@material-ui/core/Fab";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import DialogContent from "@material-ui/core/DialogContent";

import DialogContentText from "@material-ui/core/DialogContentText";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
  })
);
const fetcher = (url) => fetch(url).then((r) => r.json());
const index = () => {
  const { data, error, isValidating, mutate } = useSWR(`/api/task`, fetcher, {
    refreshInterval: 60000,
  });
  const [detail, setDetail] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const { showSnackBar } = useCustomSnackBar();
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const classes = useStyles();
  const events = new EventEmitter<{
    close: () => void;
  }>();

  events.on("close", async () => {
    await mutate();
    setIsOpen(false);
  });

  const handleOpen = () => {
    setOpenDetail(true);
  };

  const handleClose = () => {
    setOpenDetail(false);
  };
  if (!data) return <Spinner showLoading="true"></Spinner>;

  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "20%" }}></TableCell>
              <TableCell>排程名稱</TableCell>
              <TableCell>檔案類型</TableCell>
              <TableCell>執行時間</TableCell>
              <TableCell>排程執行次數</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((d) => {
                return (
                  <TableRow key={d["name"]}>
                    <TableCell component="th" scope="row">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Grid container justify="center" spacing={1}>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                  const req = await fetch(
                                    `/api/task/execute?id=${d["_id"]["$oid"]}`
                                  );
                                  const res = await req.json();
                                  showSnackBar(
                                    `已執行【${d["name"]}】排程`,
                                    "success"
                                  );
                                }}
                              >
                                執行
                              </Button>
                            </Grid>
                            <Grid item>
                              {" "}
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                  const detailData = d;
                                  detailData["modalTitle"] = "編輯";
                                  detailData["disable"] = false;
                                  setDetail(detailData);
                                  // reset(detailData)
                                  setOpenForm(true);
                                }}
                              >
                                編輯
                              </Button>{" "}
                            </Grid>
                            <Grid item>
                              {" "}
                              <Button
                                variant="contained"
                                onClick={() => {
                                  const detailData = d;
                                  detailData["modalTitle"] = "明細";
                                  detailData["disable"] = true;
                                  setDetail(detailData);
                                  setOpenForm(true);
                                }}
                              >
                                明細
                              </Button>
                            </Grid>

                            <Grid item>
                              {" "}
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={async () => {
                                  const req = await fetch(
                                    `/api/task/delete?id=${d["_id"]["$oid"]}`
                                  );
                                  const res = await req.json();
                                  showSnackBar(
                                    `已刪除【${d["name"]}】排程`,
                                    "warning"
                                  );
                                  await mutate();
                                }}
                              >
                                刪除
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell>{d["name"]}</TableCell>
                    <TableCell>{d["type"]}</TableCell>
                    <TableCell>{d["executeTime"]}</TableCell>
                    <TableCell>
                      {d["count"] && (
                        <Fab
                          color="primary"
                          onClick={async () => {
                            try {
                              const detailData = d;
                              console.log(d["_id"]["$oid"]);
                              const getDetailList = await fetch(
                                `/api/task/history/list?id=${d["_id"]["$oid"]}`
                              );
                              const listData = await getDetailList.json();
                              console.log(listData[0]["data"]);
                              detailData["list"] = listData[0]["data"];
                              setDetail(detailData);
                              handleOpen();
                              console.log(detail);
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          <Assignment />
                          {d["count"]}次
                        </Fab>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {
        <Dialog
          onClose={handleClose}
          aria-labelledby="simple-dialog-title"
          open={openDetail}
        >
          <DialogTitle id="simple-dialog-title">{detail["name"]}</DialogTitle>
          <List>
            {detail["list"] &&
              detail["list"].map((l) => (
                <ListItem
                  button
                  key={l.id}
                  onClick={async () => {
                    const link = document.createElement("a");
                    link.download = `${l.id}`;
                    link.target = "_blank";
                    link.href = `/api/task/history/detail?schedule_id=${detail["_id"]["$oid"]}&record_id=${l.id}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <CloudDownload />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      new Date(l["createdTime"]["$date"])
                        .toISOString()
                        .replace("T", " ")
                        .split(".")[0]
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Dialog>
      }
      {
        <Dialog
          fullScreen
          onClose={() => {
            setOpenForm(false);
          }}
          open={openForm}
        >
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  setOpenForm(false);
                }}
                aria-label="close"
              >
                <CloseOutLined />
              </IconButton>
              <Typography variant="h6">{detail["name"]}</Typography>
            </Toolbar>
          </AppBar>
          <DialogTitle>{detail["name"]}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <TaskForm detail={detail} events={events}></TaskForm>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
};

export default index;
