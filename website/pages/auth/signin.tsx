import { csrfToken, getCsrfToken, signIn, useSession } from "next-auth/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import Spinner from "../components/spinner";

import { toast, ToastContainer } from "react-toastify";
import { checkIsLogin } from "../../helpers/common_helper";

export default function SignIn({ csrfToken }) {
// useEffect(()=>{
//   checkIsLogin();
// });
  const router = useRouter();
  const schema = yup.object().shape({
    userName: yup.string().required("不能為空值"),
    password: yup.string().required("不能為空值"),
  });
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [showLoading, setshowLoading] = useState(false);
  const [customError, setCustomError] = useState("");
  const onSubmit = (data) => {
    setCustomError("")
    setshowLoading(true)
    signIn("credentials", {
      username: data.userName,
      password: data.password,
      redirect: false,
    }).then((r) => {
      setshowLoading(false)
     if (r.error === null) {
        toast("已登入", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setTimeout(() => {
          router.push("/");
        }, 1000);

     } else {
       setCustomError(r['error'])
     }

    });
  };
  return (
      <div className='d-flex p-2 bd-highlight justify-content-center align-items-center align-self-center"'>
        <div className="card" style={{ width: "1000px" }}>
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

              <input
                type="submit"
                className="btn btn-primary"
                value="送出"
              ></input>
              {
                customError && <div className="animate__animated animate__wobble p-3 m-2 bg-danger text-white">{customError}</div>
              }
            </form>
          </div>
        </div>
        <Spinner showLoading={showLoading}></Spinner>

      </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
