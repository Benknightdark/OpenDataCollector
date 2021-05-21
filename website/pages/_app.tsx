
import React from 'react'
import '../styles/globals.css'
import Layout from './components/layout'

function MyApp({ Component, pageProps }) {


  return <Layout>
    <div className="container-fluid px-1">
      <Component {...pageProps} />
    </div>
  </Layout>
}

export default MyApp
