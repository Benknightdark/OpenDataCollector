import Head from 'next/head'
import Dashboard from './components/dahsboard'

export default function Home() {
  return (
    <div>
      <Head>
        <title>OpenData Collector</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossOrigin="anonymous"></link>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossOrigin="anonymous"></script>
        <link href="https://fonts.googleapis.com/css2?family=Material+Icons"
          rel="stylesheet"></link>
      </Head>
      <div className="container px-1">
        <div className='row justify-content-center  px-2   no-gutters p-2'>
          <div className='col-md-6  col-sm-12'>
               <Dashboard serviceName='kao_service'/> 
          </div>
        
        </div>
      </div>
    </div>  
  )
}
