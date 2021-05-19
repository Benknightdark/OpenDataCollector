import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { checkIsLogin } from '../helpers/common_helper'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange =async  (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? 'with' : 'without'
        } shallow routing`
      )
      if(url.toUpperCase().includes('AUTH'.toUpperCase())){
        await checkIsLogin();
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
