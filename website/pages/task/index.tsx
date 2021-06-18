import React, { useState } from "react";
import useSWR from "swr";
import Spinner from "../components/spinner";
import Modal from "react-modal";
import TaskForm from "../components/TaskForm";
import { EventEmitter } from "tsee";
import { useCustomSnackBar } from "../components/hooks/custom-snackbar-context";
import Assignment from "@material-ui/icons/Assignment";
import CloudDownload from "@material-ui/icons/CloudDownload";

import Fab from "@material-ui/core/Fab";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";

const fetcher = (url) => fetch(url).then((r) => r.json());
const index = () => {
  const { data, error, isValidating, mutate } = useSWR(`/api/task`, fetcher, {
    refreshInterval: 60000,
  });
  const [detail, setDetail] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const { showSnackBar } = useCustomSnackBar();
  const [openDetail, setOpenDetail] = useState(false);

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
    <div>
      <button
        className="btn btn-info"
        onClick={async () => {
          const detailData = {
            name: "",
            executeTime: "",
            url: "",
            type: "",
          };
          detailData["modalTitle"] = "新增";
          detailData["disable"] = false;
          setDetail(detailData);
          setIsOpen(true);
        }}
      >
        新增排程
      </button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">排程名稱</th>
              <th scope="col">檔案類型</th>
              <th scope="col">執行時間</th>
              <th scope="col">排程執行次數</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((d) => {
                return (
                  <tr>
                    <th>
                      <div style={{ display: "inline-block" }}>
                        <button
                          className="btn btn-info"
                          style={{ marginRight: "5px" }}
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
                        </button>
                        <button
                          className="btn btn-warning"
                          style={{ marginRight: "5px" }}
                          onClick={() => {
                            const detailData = d;
                            detailData["modalTitle"] = "編輯";
                            detailData["disable"] = false;
                            setDetail(detailData);
                            // reset(detailData)
                            setIsOpen(true);
                          }}
                        >
                          編輯
                        </button>
                        <button
                          className="btn btn-success"
                          style={{ marginRight: "5px" }}
                          onClick={() => {
                            const detailData = d;
                            detailData["modalTitle"] = "明細";
                            detailData["disable"] = true;
                            setDetail(detailData);
                            //  reset(detailData)
                            setIsOpen(true);
                          }}
                        >
                          明細
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ marginRight: "5px" }}
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
                        </button>
                      </div>
                    </th>
                    <th>{d["name"]}</th>
                    <th>{d["type"]}</th>
                    <th>{d["executeTime"]}</th>
                    <th>
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
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </table>
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
                  <ListItem button key={l.id} onClick={async ()=>{
                    const link = document.createElement("a");
                    link.download = `${l.id}`;
                    link.target = "_blank";
                    link.href = `/api/task/history/detail?schedule_id=${detail['_id']['$oid']}&record_id=${l.id}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                  }}>
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
          <Modal
            isOpen={modalIsOpen}
            appElement={document.querySelector("#root")}
          >
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsOpen(false);
                }}
                aria-label="Close"
              >
                <span aria-hidden="true" style={{ fontSize: "40px" }}>
                  x
                </span>
              </button>
            </div>
            <TaskForm detail={detail} events={events}></TaskForm>
          </Modal>
        }
      </div>
    </div>
  );
};

export default index;
