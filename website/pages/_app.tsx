
import React from 'react'
import '../styles/globals.css'
import Layout from './components/layout'
import { SnackbarProvider } from 'notistack';
import { Button } from '@material-ui/core';

function MyApp({ Component, pageProps }) {
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key);
  }
  return <SnackbarProvider maxSnack={3}
    ref={notistackRef}
    action={(key) => (
      <Button variant="contained" color="primary" component="span" onClick={onClickDismiss(key)}>
        關閉
      </Button>
    )}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}>
    <Layout>
      <div className="container-fluid px-1">
        <Component {...pageProps} />
      </div>
    </Layout>
  </SnackbarProvider>
}

export default MyApp
