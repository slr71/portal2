// From https://github.com/mui-org/material-ui/tree/master/examples/nextjs

import React from 'react'
import * as Sentry from "@sentry/react";
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../theme'
//import { KeycloakProvider } from '../contexts/keycloak'
import { APIProvider } from '../contexts/api'
import { UserProvider } from '../contexts/user'
import { CookiesProvider } from 'react-cookie'
import { ErrorProvider } from '../contexts/error'
import config from '../config.json'

if (config.sentryDSN) {
  Sentry.init({ 
    dsn: config.sentryDSN,
    environment: process.env.NODE_ENV
  });
}

// From https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
export function reportWebVitals({ id, name, label, value }) {
  window.gtag('event', name, {
    event_category:
      label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  })
}

function MyApp(props) {
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
    <Sentry.ErrorBoundary fallback={"An error has occurred"}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CookiesProvider>
          {/* <KeycloakProvider kauth={kauth}> */}
            <APIProvider baseUrl={baseUrl} token={token}>
              <UserProvider user={user}>
                <Head>
                  <title>User Portal - CyVerse</title>
                </Head>
                <ErrorProvider>
                  <Component {...pageProps} />
                </ErrorProvider>
              </UserProvider>
            </APIProvider>
          {/* </KeycloakProvider> */}
        </CookiesProvider>
      </ThemeProvider>
    </Sentry.ErrorBoundary>
  )
}

export default MyApp

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