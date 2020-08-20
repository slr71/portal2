// From https://github.com/mui-org/material-ui/tree/master/examples/nextjs

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import { KeycloakProvider } from '../contexts/keycloak';
import { APIProvider } from '../contexts/api';
import { UserProvider } from '../contexts/user';

export default function MyApp(props) {
  const { Component, pageProps, kauth, user, baseUrl, token } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <KeycloakProvider kauth={kauth}>
        <APIProvider baseUrl={baseUrl} token={token}>
          <UserProvider user={user}>
            <Head>
              <title>CyVerse User Portal</title>
            </Head>
            <Component {...pageProps} />
          </UserProvider>
        </APIProvider>
      </KeycloakProvider>
    </ThemeProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  return { //TODO use ctx?.req? syntax
    kauth: ctx && ctx.req ? ctx.req.kauth : null,
    user: ctx && ctx.req ? ctx.req.user : null,
    baseUrl: ctx && ctx.req && ctx.req.api ? ctx.req.api.baseUrl : null, 
    token: ctx && ctx.req && ctx.req.api ? ctx.req.api.token : null,
    pageProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {},
    namespacesRequired: ["common"]
  }
}