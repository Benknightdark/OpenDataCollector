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

    useEffect(() => {
        checkIsNotLogin();

    });
    const [detail, setDetail] = useState({});
    const [modalIsOpen, setIsOpen] = useState(false);
    const schema = yup.object().shape({
        name: yup.string().required("不能為空值"),
        executeTime: yup.string().required("不能為空值"),
        url: yup.string().required("不能為空值"),
        type: yup.string().required("不能為空值"),
    });
    const { register, handleSubmit,reset , formState: { errors },getValues } = useForm({
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
            {/* <div id='root'></div> */}
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
                                                        detailData['formType'] = 'edit'
                                                        setDetail(detailData);
                                                        reset(detailData)
                                                        setIsOpen(true);

                                                    }}
                                                >編輯</button>
                                                <button className='btn btn-success' style={{ "marginRight": "5px" }}
                                                    onClick={() => {
                                                        const detailData = d
                                                        detailData['formType'] = 'detail'
                                                        setDetail(detailData);
                                                        reset(detailData)
                                                        setIsOpen(true);

                                                    }}
                                                >明細</button>
                                                <button className='btn btn-danger' style={{ "marginRight": "5px" }}
                                                    onClick={() => {

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
                            <h2>{detail['formType'] == 'detail' ? '明細' : '編輯'}</h2>
                            <form method="post" onSubmit={handleSubmit(async () => {
                                const req=await fetch(`/api/task/edit`,{method:'PUT',body:JSON.stringify(getValues())});
                                const res=await req.json();
                                await mutate();
                                setIsOpen(false);
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
                                        disabled={detail['formType'] == 'detail' ? true : false}
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
                                        disabled={detail['formType'] == 'detail' ? true : false}

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
                                        disabled={detail['formType'] == 'detail' ? true : false}

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
                                        disabled={detail['formType'] == 'detail' ? true : false}

                                        defaultValue={detail['url']}
                                        {...register("url")}
                                    />
                                    <p>{errors.url?.message}</p>
                                </div>
                                {
                                    detail['formType'] == 'edit' && <input
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