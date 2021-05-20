
import '../styles/globals.css'
function MyApp({ Component, pageProps }) {
  // const router = useRouter()
  // const protectedRouteArray = ['task']

  // useEffect(() => {
  //   const handleRouteChange = async (url) => {
  //     if (url.toUpperCase().includes('LOGIN'.toUpperCase())) {
  //       await checkIsLogin();
  //     }else if (url.toUpperCase().includes('REGISTER'.toUpperCase())) {
  //       await checkIsLogin();
  //     } else {
  //       protectedRouteArray.map(async p => {
  //         if (url.toUpperCase().includes(p.toUpperCase())) {
  //           await checkIsNotLogin();
  //           console.log('OK')
  //         }
  //       })
  //     }
  //   }
  //   handleRouteChange(router.pathname)
  // })

  return <Component {...pageProps} />
}

export default MyApp
