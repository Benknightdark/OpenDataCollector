import React, { useEffect } from "react";
import { checkIsNotLogin } from "../../helpers/common_helper";
import Layout from "../components/layout";

const index = () => {
    useEffect(()=>{
        checkIsNotLogin();
      });
    return (
        <Layout goBack="true">
                  <div className="container-fluid px-1">

                  </div>
        </Layout>
    );
}

export default index;