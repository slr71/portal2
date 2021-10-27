// From https://github.com/mui-org/material-ui/tree/master/examples/nextjs

import React from 'react'
import getConfig from "next/config"
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
import theme from '../theme'
const config = getConfig().publicRuntimeConfig
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="description" content="The Open Science Workspace for Collaborative Data-driven Discovery"></meta>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="icon"
            type="image/x-icon"
            href="/icons/favicon.ico"
          />

          {/* Google Analytics 
            * From https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js 
            */}
          {config.GOOGLE_ANALYTICS_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${config.GOOGLE_ANALYTICS_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${config.GOOGLE_ANALYTICS_ID}', {
                    page_path: window.location.pathname,
                  });
                  `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  }
}