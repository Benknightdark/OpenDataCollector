import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { checkIsNotLogin } from "../../helpers/common_helper";
import Layout from "../components/layout";
import Spinner from "../components/spinner";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const fetcher = url => fetch(url).then(r => r.json())

const index = () => {
    const [detail, setDetail] = useState({});
    const [modalIsOpen, setIsOpen] = useState(false);
    const schema = yup.object().shape({
        name: yup.string().required("不能為空值"),
        executeTime: yup.string().required("不能為空值"),
        url: yup.string().required("不能為空值"),
        type: yup.string().required("不能為空值"),
    });
    const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
    });
    const { data, error, isValidating, mutate } = useSWR(
        `/api/task`,
        fetcher,
        {
            refreshInterval: 60000
        })
    if (!data) return <Spinner showLoading="true"></Spinner>;

    return (
        <Layout goBack="true">
            <div className="container-fluid px-1">
                <button className='btn btn-info' onClick={async () => {
                    const detailData = {
                        name: '',
                        executeTime: '',
                        url: '',
                        type: ''
                    }
                    detailData['modalTitle'] = '新增'
                    detailData['disable'] = false
                    setDetail(detailData);
                    reset(detailData)
                    setIsOpen(true);
                }}>新增排程</button>
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
                                                <button className='btn btn-info' style={{ "marginRight": "5px" }}
                                                    onClick={async () => {
                                                        const req = await fetch(`/api/task/execute?id=${d['_id']['$oid']}`);
                                                        const res = await req.json();
                                                        console.log(res)
                                                        toast.success(`已執行【${d['name']}】排程`, {
                                                            position: "top-right",
                                                            autoClose: 5000,
                                                            hideProgressBar: false,
                                                            closeOnClick: true,
                                                            pauseOnHover: true,
                                                            draggable: true,
                                                            progress: undefined,
                                                        })
                                                    }}
                                                >執行</button>
                                                <button className='btn btn-warning' style={{ "marginRight": "5px" }}
                                                    onClick={() => {
                                                        const detailData = d
                                                        detailData['modalTitle'] = '編輯'
                                                        detailData['disable'] = false
                                                        setDetail(detailData);
                                                        reset(detailData)
                                                        setIsOpen(true);

                                                    }}
                                                >編輯</button>
                                                <button className='btn btn-success' style={{ "marginRight": "5px" }}
                                                    onClick={() => {
                                                        const detailData = d
                                                        detailData['modalTitle'] = '明細'
                                                        detailData['disable'] = true
                                                        setDetail(detailData);
                                                        reset(detailData)
                                                        setIsOpen(true);

                                                    }}
                                                >明細</button>
                                                <button className='btn btn-danger' style={{ "marginRight": "5px" }}
                                                    onClick={async () => {
                                                        const req = await fetch(`/api/task/delete?id=${d['_id']['$oid']}`)
                                                        const res = await req.json();
                                                        console.log(res);
                                                        toast.warning(`已刪除【${d['name']}】排程`, {
                                                            position: "top-right",
                                                            autoClose: 5000,
                                                            hideProgressBar: false,
                                                            closeOnClick: true,
                                                            pauseOnHover: true,
                                                            draggable: true,
                                                            progress: undefined,
                                                        })
                                                    }}
                                                >刪除</button>
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
                {
                    <Modal
                        isOpen={modalIsOpen}
                        appElement={document.querySelector('#root')}
                        contentLabel="Example Modal">
                        <div className='d-flex justify-content-end'>
                            <button type="button" className="btn"
                                onClick={() => { setIsOpen(false) }}
                                aria-label="Close">
                                <span aria-hidden="true" style={{ 'fontSize': '40px' }}>x</span>
                            </button>
                        </div>
                        <div>
                            <h2>{detail['modalTitle']}</h2>
                            <form method="post" onSubmit={handleSubmit(async () => {
                                let res = {};
                                let infoText:string='';
                                if (detail['modalTitle'] == '編輯') {
                                    const req = await fetch(`/api/task/edit`, { method: 'PUT', body: JSON.stringify(getValues()) });
                                    res = await req.json();
                                    infoText=`已更新【${getValues()['name']}】排程`;

                                }else{
                                    const req = await fetch(`/api/task/add`, { method: 'POST', body: JSON.stringify(getValues()) });
                                    res = await req.json();
                                    infoText=`已加入【${getValues()['name']}】排程`;

                                }
                                if (res['status']) {
                                    await mutate();
                                    toast.info(infoText, {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                    })
                                    setIsOpen(false);
                                } else {
                                    alert("發生錯誤");
                                }

                            })}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        排程名稱</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        defaultValue={detail['name']}
                                        disabled={detail['disable']}
                                        {...register("name")}
                                    />
                                    <p>{errors.name?.message}</p>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">
                                        檔案類型</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="type"
                                        name="type"
                                        disabled={detail['disable']}

                                        defaultValue={detail['type']}
                                        {...register("type")}
                                    />
                                    <p>{errors.type?.message}</p>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="executeTime" className="form-label">
                                        執行時間</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="executeTime"
                                        name="executeTime"
                                        disabled={detail['disable']}

                                        defaultValue={detail['executeTime']}
                                        {...register("executeTime")}
                                    />
                                    <p>{errors.executeTime?.message}</p>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="url" className="form-label">
                                        下載網址</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="url"
                                        name="url"
                                        disabled={detail['disable']}

                                        defaultValue={detail['url']}
                                        {...register("url")}
                                    />
                                    <p>{errors.url?.message}</p>
                                </div>
                                {
                                    detail['disable'] == false && <input
                                        type="submit"
                                        className="btn btn-primary"
                                        value="送出"
                                    ></input>
                                }
                            </form>
                        </div>
                    </Modal>
                }
            </div>
        </Layout>
    );
}

export default index;