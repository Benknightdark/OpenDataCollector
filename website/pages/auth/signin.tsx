import { getCsrfToken, signIn } from "next-auth/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import Spinner from "../components/spinner";
import { useCustomSnackBar } from "../components/hooks/custom-snackbar-context";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  })
);
export default function SignIn({ csrfToken }) {
  const classes = useStyles();

  const router = useRouter();
  const schema = yup.object().shape({
    userName: yup.string().required("不能為空值"),
    password: yup.string().required("不能為空值"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [showLoading, setshowLoading] = useState(false);
  const [customError, setCustomError] = useState("");
  const showSnackBar = useCustomSnackBar();

  const onSubmit = (data) => {
    setCustomError("");
    setshowLoading(true);
    signIn("credentials", {
      username: data.userName,
      password: data.password,
      redirect: false,
    }).then((r) => {
      setshowLoading(false);
      if (r.error === null) {
        showSnackBar.showSnackBar("已登入", "info");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setCustomError(r["error"]);
      }
    });
  };
  return (
    <Grid
      container
      justify="center"
      alignItems="baseline"
      direction="row"
      className={classes.root}
    >
      <Grid item xs={12} md={6}>
        <Card className='card'>
          <CardHeader title="登入" className="gradient-green"></CardHeader>
          <CardContent>
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

              <InputLabel>帳號</InputLabel>
              <Input
                fullWidth={true}
                type="text"
                className="form-control"
                id="userName"
                name="userName"
                {...register("userName")}
              />
              <p>{errors.userName?.message}</p>
              <InputLabel>密碼</InputLabel>
              <Input
                fullWidth={true}
                type="password"
                className="form-control"
                id="password"
                name="password"
                {...register("password")}
              />
              <p>{errors.password?.message}</p>

              <Button type="submit" variant="contained" color="primary">送出</Button>
              {customError && (
                <Alert
                  className="animate__animated animate__wobble"
                  severity="error"
                >
                  {customError}
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Spinner showLoading={showLoading}></Spinner>
    </Grid>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
