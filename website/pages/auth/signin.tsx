import { csrfToken, getCsrfToken, signIn } from "next-auth/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/layout";
export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const schema = yup.object().shape({
    userName: yup.string().required("不能為空值"),
    password: yup.string().required("不能為空值"),
  });
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    console.log(data);
    signIn("credentials", {
      username: data.userName,
      password: data.password,
      redirect: false,
    }).then((r) => {
      if (r.error === null) {
        router.push("/");
      }
    });
  };
  console.log(errors);
  return (
    <Layout goBack="true">
      <div className='d-flex p-2 bd-highlight justify-content-center align-items-center align-self-center"'>
      <div className="card" style={{width: "1000px"}}>
        <div className="card-header">登入</div>
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
                ref={register({ required: true })}
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
                ref={register({ required: true })}
              />
              <p>{errors.password?.message}</p>
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
