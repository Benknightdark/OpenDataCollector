import Head from "next/head";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";


export default function CustomHeader(props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState();
  useEffect(() => {
    (async () => {
      const req = await fetch("/api/personal");
      const res = await req.json();
      if (res?.message == null) {
        // const dis = JSON.parse(res?.user?.name).displayName;
        setDisplayName(res?.displayName);
      }
    })();
  });

  return (
    <div>
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <Head>
        <title>OpenData Collector</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
          crossOrigin="anonymous"
        ></link>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
          crossOrigin="anonymous"
        ></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Icons"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
          crossOrigin="anonymous"
        />
      </Head>

      <nav className="navbar navbar-light bg-light custom-nav-bar">
        <div className="container-fluid">
          <div className="navbar-brand">

            {props.goBack == "true" && (
              <img
                src="/back.svg"
                alt=""
                width="30"
                height="27"
                className="d-inline-block align-text-top"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.back();
                }}
              />
            )}
            <div className="d-inline-block">
              <h3 style={{ cursor: "pointer" }} onClick={() => {
                router.push('/')
              }}>OpenData Collector</h3>
            </div>
          </div>
          <div
            className="d-flex justify-content-end"
            style={{ display: "flex" }}
          >
            <div>
              {displayName ? (
                <button
                  className="btn"
                  type="button"
                  onClick={async () => {
                    const req = await signOut({ redirect: false });
                    setDisplayName(null)
                    toast("已登出", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      })
                  }}
                >
                  hi~ {displayName} 登出
                </button>
              ) : (
                <div>
                  <button
                    className="btn"
                    type="button"
                    onClick={async () => {

                      router.push("/auth/register");
                    }}
                  >
                    註冊
                </button>
                  <div className="material-icons" style={{ fontSize: "20px" }}>
                    more_vert
                  </div>
                  <button
                    className="btn"
                    type="button"
                    onClick={async () => {
                      router.push("/auth/signin");
                    }}
                  >
                    登入
                </button>
                </div>

              )}

            </div>
          </div>
        </div>
      </nav>
      <span
        className="material-icons  scroll-btn"
        style={{ fontSize: "60px" }}
        onClick={() => {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }}
      >
        keyboard_arrow_up
      </span>

    </div>
  );
}
