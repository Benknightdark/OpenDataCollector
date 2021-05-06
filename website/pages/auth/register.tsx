import { csrfToken, getCsrfToken, signIn } from "next-auth/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "../components/layout";
import { checkIsLogin } from "../../helpers/common_helper";
export default function Register({ csrfToken }) {
  useEffect(()=>{
    checkIsLogin();
  });
  const router = useRouter();
  const schema = yup.object().shape({
    userName: yup.string().required("不能為空值"),
    password: yup.string().required("不能為空值"),
    email: yup.string().required("不能為空值"),
    displayName: yup.string().required("不能為空值"),
  });
  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    (async () => {
      const req = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(data), headers: { 'content-type': "application/json" } });
      const res = await req.json();
      if (res?.token) {
        signIn("credentials", {
          username: data.userName,
          password: data.password,
          redirect: false,
        }).then((r) => {
          if (r.error === null) {
            router.push("/");
          } else {
            alert(r['error'])
          }
        });
      }
    })()
  };
  return (
    <Layout goBack="true">
      <div className='d-flex p-2 bd-highlight justify-content-center align-items-center align-self-center"'>
        <div className="card" style={{ width: "1000px" }}>
          <div className="card-header">註冊</div>
          <div className="card-body">
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className="mb-3">
                <label htmlFor="userName" className="form-label">
                  帳號
              </label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  name="userName"
                  {...register("userName")}
                />
                <p>{errors.userName?.message}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  密碼
              </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  {...register("password")}
                />
                <p>{errors.password?.message}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
              </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  {...register("email")}
                />
                <p>{errors.email?.message}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="displayName" className="form-label">
                  顯示名稱
              </label>
                <input
                  type="displayName"
                  className="form-control"
                  id="displayName"
                  name="displayName"
                  {...register("displayName")}
                />
                <p>{errors.displayName?.message}</p>
              </div>
              <input
                type="submit"
                className="btn btn-primary"
                value="送出"
              ></input>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
