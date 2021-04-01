import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession ,signOut} from "next-auth/client";
export default function CustomHeader(props) {
  const router = useRouter();
  const [session, loading] = useSession();

  if (session) {
    console.log(session);
  }
  return (
    <div>
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
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="javascript:void(0)">
            {props.goBack == "true" && (
              <img
                src="/back.svg"
                alt=""
                width="30"
                height="27"
                className="d-inline-block align-text-top"
                onClick={() => {
                  router.back();
                }}
              />
            )}
            <div className="d-inline-block p-2">
              <h3>OpenData Collector</h3>
            </div>
           {
             session?<button type='button' onClick={async ()=>{
              const req=await signOut({redirect:false});
              console.log(req);

             }}>登出</button>:<button type='button' onClick={async ()=>{
              router.push('/auth/signin')
             }}>登入</button>
           }
          </a>
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
