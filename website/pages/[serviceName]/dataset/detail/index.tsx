import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"
import CustomHeader from "../../../components/custom-header"
import Layout from "../../../components/layout"
import Spinner from "../../../components/spinner"
const detailData = (serviceName: string | string[], pageUrl: string | string[]) => {
    const { data, error, isValidating, mutate } = useSWR(
        `/api/dataset/detail?serviceName=${serviceName}&pageUrl=${pageUrl}`,
        fetcher,
        {
            refreshInterval: 60000
        })
    return { data, error, isValidating, mutate }
}
const fetcher = url => fetch(url).then(r => r.json())
export default function Index() {
    const router = useRouter()
    const { serviceName, queryUrl } = router.query
    const fetchDetailData = detailData(serviceName, queryUrl)
    console.log(fetchDetailData.data)
    if (!fetchDetailData.data) return <Spinner showLoading='true'></Spinner>
    return <Layout goBack='true'>

        <div className="container-fluid px-1">

            <div className="d-flex flex-column  p-3 mb-3 bd-highlight flex-wrap justify-content-center">
                <div className="card  border-success bg-light">
                    <div className="card-body">
                        <h1>                {fetchDetailData.data.title}
                        </h1>
                    </div>
                </div>
                <hr></hr>

                <div className="d-flex  flex-lg-row  flex-xl-row flex-xxl-row flex-sm-column  flex-column flex-xs-column p-3 mb-3 bd-highlight flex-wrap justify-content-center">
                    {
                        fetchDetailData.data.statics.map(s => <div className="card  border-info bg-light p-3 m-3">
                            <div className="card-body">
                                <h3 className="quote-text">                {s.name}
                                </h3>
                                <hr></hr>
                                <h2 className="text-center">                {s.value}
                                </h2>
                            </div>
                        </div>)
                    }
                </div>
                <hr></hr>

                <div className="list-group">
                    {
                        fetchDetailData.data.resources.map(r => <div className="list-group-item" style={{ borderBottom: '5px solid red' }}>
                            <div className="d-flex justify-content-between">

                                <div>{r.name}</div>
                                <span className='label' data-format={r.type.toLowerCase()}>{r.type}</span>
                            </div>
                            <hr></hr>
                            <blockquote>
                                {r.description}
                            </blockquote>
                            <div className='p-3'></div>
                            <div className="d-grid gap-2 d-md-block d-md-flex  justify-content-md-center">
                                <button className='btn btn-info m-lg-2' onClick={
                                    () => {
                                        // Construct the 'a' element
                                        const link = document.createElement("a");
                                        link.download = 'download';
                                        link.target = "_blank";

                                        // Construct the URI
                                        link.href = r.downloadLink;
                                        document.body.appendChild(link);
                                        link.click();

                                        // Cleanup the DOM
                                        document.body.removeChild(link);
                                    }
                                }>下載</button>
                                <button className="btn btn-primary m-lg-2" type="button" onClick={() => {
                                    window.open(r.detail);

                                }}>明細</button>
                            </div>
                        </div>

                        )
                    }


                </div>


            </div>
        </div>
    </Layout>
}