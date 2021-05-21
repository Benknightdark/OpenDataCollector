
import React from 'react'
import Dashboard from './components/dahsboard'

export default function Home() {
  return (


    <div className='row  bd-highlight'>
      <Dashboard serviceName='kao-service' />
      <Dashboard serviceName='tainan-service' />
      <Dashboard serviceName='taichung-service' />
      <Dashboard serviceName='pthg-service' />
    </div>

  )
}
