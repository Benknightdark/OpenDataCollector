import { getCsrfToken, signIn } from "next-auth/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  })
);
export default function Register({ csrfToken }) {
  const classes = useStyles();
  const router = useRouter();
  const schema = yup.object().shape({
    userName: yup.string().required("不能為空值"),
    password: yup.string().required("不能為空值"),
    email: yup.string().required("不能為空值"),
    displayName: yup.string().required("不能為空值"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit =async  (data) => {
      const req = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      });
      const res = await req.json();
      console.log(res)
      if (res?.token) {
        signIn("credentials", {
          username: data.userName,
          password: data.password,
          redirect: false,
        }).then((r) => {
          if (r.error === null) {
            router.push("/");
          } else {
            alert(r["error"]);
          }
        });
      }
    
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
        <Card className="card">
          <CardHeader title="註冊" className="gradient-red"></CardHeader>
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

              <InputLabel>Email</InputLabel>
              <Input
                fullWidth={true}
                type="email"
                className="form-control"
                id="email"
                name="email"
                {...register("email")}
              />
              <p>{errors.email?.message}</p>

              <InputLabel>顯示名稱</InputLabel>
              <Input
                fullWidth={true}
                type="text"
                className="form-control"
                id="displayName"
                name="displayName"
                {...register("displayName")}
              />
              <p>{errors.displayName?.message}</p>
              <Button type="submit" variant="contained" color="primary">
                送出
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    // <div className='d-flex p-2 bd-highlight justify-content-center align-items-center align-self-center"'>
    //   <div className="card" style={{ width: "1000px" }}>
    //     <div className="card-header">註冊</div>
    //     <div className="card-body">
    //       <form method="post" onSubmit={handleSubmit(onSubmit)}>
    //         <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
    //         <div className="mb-3">
    //           <label htmlFor="userName" className="form-label">
    //             帳號
    //           </label>
    //           <input
    //             type="text"
    //             className="form-control"
    //             id="userName"
    //             name="userName"
    //             {...register("userName")}
    //           />
    //           <p>{errors.userName?.message}</p>
    //         </div>
    //         <div className="mb-3">
    //           <label htmlFor="password" className="form-label">
    //             密碼
    //           </label>
    //           <input
    //             type="password"
    //             className="form-control"
    //             id="password"
    //             name="password"
    //             {...register("password")}
    //           />
    //           <p>{errors.password?.message}</p>
    //         </div>
    //         <div className="mb-3">
    //           <label htmlFor="email" className="form-label">
    //             Email
    //           </label>
    //           <input
    //             type="email"
    //             className="form-control"
    //             id="email"
    //             name="email"
    //             {...register("email")}
    //           />
    //           <p>{errors.email?.message}</p>
    //         </div>
    //         <div className="mb-3">
    //           <label htmlFor="displayName" className="form-label">
    //             顯示名稱
    //           </label>
    //           <input
    //             type="displayName"
    //             className="form-control"
    //             id="displayName"
    //             name="displayName"
    //             {...register("displayName")}
    //           />
    //           <p>{errors.displayName?.message}</p>
    //         </div>
    //         <input
    //           type="submit"
    //           className="btn btn-primary"
    //           value="送出"
    //         ></input>
    //       </form>
    //     </div>
    //   </div>
    // </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
