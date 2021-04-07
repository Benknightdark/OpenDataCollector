import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Layout from "../../../components/layout";
import Spinner from "../../../components/spinner";
import { useEffect, useState } from "react";
const detailData = (
  serviceName: string | string[],
  pageUrl: string | string[]
) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/api/dataset/detail?serviceName=${serviceName}&pageUrl=${pageUrl}`,
    fetcher,
    {
      refreshInterval: 60000,
    }
  );
  return { data, error, isValidating, mutate };
};
const fetcher = (url) => fetch(url).then((r) => r.json());
export default function Index() {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(true);
  const [showFile, setShowFile] = useState(true);

  const { serviceName, queryUrl } = router.query;
  const fetchDetailData = detailData(serviceName, queryUrl);
  console.log(fetchDetailData.data);
  useEffect(() => {});
  if (!fetchDetailData.data) return <Spinner showLoading="true"></Spinner>;
  return (
    <Layout goBack="true">
      <div className="container-fluid px-1">
        <div className="d-flex flex-column  p-3 mb-3 bd-highlight flex-wrap justify-content-center">
          <div className="card  border-success bg-light">
            <div className="card-body">
              <h1> {fetchDetailData.data.title}</h1>
            </div>
          </div>
          <hr></hr>

          {fetchDetailData.data.statics.length > 0 && (
            <div>
              <div className="d-flex  flex-lg-row  flex-xl-row flex-xxl-row flex-sm-column  flex-column flex-xs-column p-3 mb-3 bd-highlight flex-wrap justify-content-center">
                {fetchDetailData.data.statics.map((s) => (
                  <div className="card  border-info bg-light p-3 m-3">
                    <div className="card-body">
                      <h3 className="quote-text"> {s.name}</h3>
                      <hr></hr>
                      <h2 className="text-center"> {s.value}</h2>
                    </div>
                  </div>
                ))}
              </div>
              <hr></hr>
            </div>
          )}
          <div className="accordion border border-danger" id="infomation">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingInfomation">
                <button
                  className={
                    showInfo ? "accordion-button" : "accordion-button collapsed"
                  }
                  type="button"
                  onClick={() => {
                    setShowInfo(!showInfo);
                  }}
                >
                  欄位資訊
                </button>
              </h2>
              <div
                className={
                  showInfo
                    ? "accordion-collapse collapse show"
                    : "accordion-collapse collapse collapsed"
                }
              >
                <div className="accordion-body">
                  <div className="p-3">
                    <div className="table-responsive">
                      <table className="table table-bordered border-primary table-hover">
                        <thead className="table-warning">
                          <tr>
                            <th scope="col">名稱</th>
                            <th scope="col">值</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fetchDetailData.data.infomation.map((s) => (
                            <tr>
                              <th scope="row">{s.name}</th>
                              <td>{s.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className="accordion border border-danger" id="fileList">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className={
                    showFile ? "accordion-button" : "accordion-button collapsed"
                  }
                  type="button"
                  onClick={() => {
                    setShowFile(!showFile);
                  }}
                >
                  檔案下載
                </button>
              </h2>
              <div
                className={
                  showFile
                    ? "accordion-collapse collapse show"
                    : "accordion-collapse collapse collapsed"
                }
              >
                <div className="accordion-body">
                  <div className="list-group">
                    {fetchDetailData.data.resources.map((r) => (
                      <div
                        className="list-group-item"
                        style={{ borderBottom: "5px solid red" }}
                      >
                        <div className="d-flex justify-content-between">
                          <div>{r.name}</div>
                          <span
                            className="label"
                            data-format={r.type.toLowerCase()}
                          >
                            {r.type}
                          </span>
                        </div>
                        <hr></hr>
                        <blockquote>{r.description}</blockquote>
                        <div className="p-3"></div>
                        <div className="d-grid gap-2 d-md-block d-md-flex  justify-content-md-center">
                          <button
                            className="btn btn-info m-lg-2"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.download = "download";
                              link.target = "_blank";
                              link.href = r.downloadLink;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            下載
                          </button>
                          <button
                            className="btn btn-primary m-lg-2"
                            type="button"
                            onClick={() => {
                              window.open(r.detail);
                            }}
                          >
                            明細
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
