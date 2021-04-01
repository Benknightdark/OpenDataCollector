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
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            userName
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
            password
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

        <input type="submit" className="btn btn-primary" value="Submit"></input>
      </form>
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
