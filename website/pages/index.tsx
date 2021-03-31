
import React from 'react'
import CustomHeader from './components/custom-header'
import Dashboard from './components/dahsboard'
import Layout from './components/layout'

export default function Home() {
  return (

    <Layout>
      <div className="container-fluid px-1">
        <div className='d-flex p-1 bd-highlight flex-wrap justify-content-evenly'>
          <Dashboard serviceName='kao-service' />
          <Dashboard serviceName='tainan-service' />
        </div>
      </div>
    </Layout>
  )
}
