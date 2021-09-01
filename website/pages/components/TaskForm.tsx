import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCustomSnackBar } from "./hooks/custom-snackbar-context";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";

const TaskForm = ({ detail, events }) => {
  const schema = yup.object().shape({
    name: yup.string().required("不能為空值"),
    executeTime: yup.string().required("不能為空值"),
    url: yup.string().required("不能為空值"),
    type: yup.string().required("不能為空值"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { showSnackBar } = useCustomSnackBar();

  return (
    <div>
      <h2>{detail?.modalTitle}</h2>
      <div>
        <form
          method="post"
          onSubmit={handleSubmit(async () => {
            let res = {};
            let infoText: string = "";
            if (detail?.modalTitle == "編輯") {
              let bodyData = getValues();
              bodyData["_id"] = {};
              bodyData["_id"]["$oid"] = detail["_id"]["$oid"];
              const req = await fetch(`/api/task/edit`, {
                method: "PUT",
                body: JSON.stringify(bodyData),
              });
              res = await req.json();
              infoText = `已更新【${getValues()["name"]}】排程`;
            } else {
              const req = await fetch(`/api/task/add`, {
                method: "POST",
                body: JSON.stringify(getValues()),
              });
              res = await req.json();
              infoText = `已加入【${getValues()["name"]}】排程`;
            }
            if (res["status"]) {
              showSnackBar(infoText, "info");
              events.emit("close");
              reset();
            } else {
              alert("發生錯誤");
            }
          })}
        >
          <div>
            <InputLabel>排程名稱</InputLabel>
            <Input
              fullWidth={true}
              type="text"
              className="form-control"
              id="name"
              name="name"
              defaultValue={detail?.name}
              disabled={detail?.disable}
              autoFocus={true}
              {...register("name")}
            />
            <p>{errors.name?.message}</p>
          </div>
          <div className="mb-3">
            <InputLabel>
              檔案類型
            </InputLabel>
            <Input
              fullWidth={true}
              autoFocus={true}
              type="text"
              className="form-control"
              id="type"
              name="type"
              disabled={detail?.disable}
              defaultValue={detail?.type}
              {...register("type")}
            />
            <p>{errors.type?.message}</p>
          </div>
          <div className="mb-3">
            <InputLabel>
              執行時間
            </InputLabel>
            <Input
              fullWidth={true}
              autoFocus={true}
              inputProps={{
                step: 300, // 5 min
              }}
              type="time"
              className="form-control"
              id="executeTime"
              name="executeTime"
              disabled={detail?.disable}
              defaultValue={detail?.executeTime}
              {...register("executeTime")}
            />
            <p>{errors.executeTime?.message}</p>
          </div>
          <div className="mb-3">
            <InputLabel>
              下載網址
            </InputLabel>
            <Input
              fullWidth={true}
              autoFocus={true}
              type="text"
              className="form-control"
              id="url"
              name="url"
              disabled={detail?.disable}
              defaultValue={detail?.url}
              {...register("url")}
            />
            <p>{errors.url?.message}</p>
          </div>
          {detail?.disable == false && (
            <Button variant="contained" color="primary" type="submit">
              送出
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
