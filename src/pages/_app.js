// From https://github.com/mui-org/material-ui/tree/master/examples/nextjs

import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../theme'
//import { KeycloakProvider } from '../contexts/keycloak'
import { APIProvider } from '../contexts/api'
import { UserProvider } from '../contexts/user'
import { CookiesProvider } from 'react-cookie'
import config from '../config.json'

export default function MyApp(props) {
  const { Component, pageProps, kauth, user, baseUrl, token } = props

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }

    // Setup Intercom chat
    window.intercomSettings = {
      app_id: config.intercom.appId,
      alignment: "right",
      hide_default_launcher: true,
    }

    // Load Intercom library -- copied from developer docs, modified app ID
    var w=window;var ic=w.Intercom;if(typeof ic==="function") {ic('reattach_activator');ic('update',w.intercomSettings);}else {var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${config.intercom.appId}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookiesProvider>
        {/* <KeycloakProvider kauth={kauth}> */}
          <APIProvider baseUrl={baseUrl} token={token}>
            <UserProvider user={user}>
              <Head>
                <title>CyVerse User Portal</title>
              </Head>
              <Component {...pageProps} />
            </UserProvider>
          </APIProvider>
        {/* </KeycloakProvider> */}
      </CookiesProvider>
    </ThemeProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const req = ctx.req
  const api = req && req.api
  return {
    kauth: req && req.kauth,
    baseUrl: api && api.baseUrl, 
    token: api && api.token,
    user: api && api.token ? await api.user() : null,
    pageProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {},
  }
}