
import React from 'react'
import Dashboard from './components/dahsboard'
import Layout from './components/layout'

export default function Home() {
  return (

    <Layout>
      <div className="container-fluid px-1">
        <div className='row  bd-highlight'>
          <Dashboard serviceName='kao-service' />
          <Dashboard serviceName='tainan-service' />
          <Dashboard serviceName='taichung-service' />

          <Dashboard serviceName='pthg-service' />
        </div>
      </div>
    </Layout>
  )
}
