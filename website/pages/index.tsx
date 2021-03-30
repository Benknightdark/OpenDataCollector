
import CustomHeader from './components/custom-header'
import Dashboard from './components/dahsboard'

export default function Home() {
  return (
    <div>
     <CustomHeader/>
      <div className="container-fluid px-1">
        <div className='d-flex p-1 bd-highlight flex-wrap justify-content-evenly'>
            <Dashboard serviceName='kao-service' />
            <Dashboard serviceName='tainan-service' />
        </div>
      </div>
    </div>
  )
}
