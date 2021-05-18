import React, { useEffect } from "react";
import useSWR from "swr";
import { checkIsNotLogin } from "../../helpers/common_helper";
import Layout from "../components/layout";
import Spinner from "../components/spinner";
const fetcher = url => fetch(url).then(r => r.json())

const index = () => {
    useEffect(() => {
        checkIsNotLogin();
    });
    const { data, error, isValidating, mutate } = useSWR(
        `/api/task`,
        fetcher,
        {
            refreshInterval: 60000
        })
    console.log(data)
    if (!data) return <Spinner showLoading="true"></Spinner>;

    return (
        <Layout goBack="true">
            <div className="container-fluid px-1">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">排程名稱</th>
                                <th scope="col">檔案類型</th>
                                <th scope="col">執行時間</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.map(d => {
                                    return <tr>
                                        <th>
                                            <div style={{ "display": "inline-block" }}>
                                                <button className='btn btn-info' style={{"marginRight":"5px"}}
                                                onClick={()=>{
                                                    console.log(d['_id']['$oid'])
                                                }}
                                                >執行</button>
                                                <button className='btn btn-warning' style={{"marginRight":"5px"}}>編輯</button>
                                                <button className='btn btn-danger' style={{"marginRight":"5px"}}>刪除</button>
                                            </div>
                                        </th>
                                        <th>{d['name']}</th>
                                        <th>{d['type']}</th>
                                        <th>{d['executeTime']}</th>

                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}

export default index;