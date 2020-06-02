
export const GlobalCss = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
      // You should target [class*="MuiButton-root"] instead if you nest themes.
      '.MuiContainer-root': {
        width: '100%',
      },
      '.MuiCard-root':{
        minHeight: '105%'
      },
    },
  })(() => null);
  <GlobalCss />