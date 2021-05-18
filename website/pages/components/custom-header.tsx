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
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
          rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
          crossOrigin="anonymous"/>

          <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossOrigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js" integrity="sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT" crossOrigin="anonymous"></script>
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
                  <div>
                    <button className="btn btn-danger" onClick={async () => {
                      router.push('/task')
                    }}>排程</button>
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
                  </div>
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
