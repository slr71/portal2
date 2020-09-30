import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#0c91db',
        main: '#0971ab',
        dark: '#06517b',
        contrastText: '#fff',
      },
      secondary: {
        light: '#E33371',
        main: '#DC004E',
        dark: '#AB003C',
        contrastText: '#fff',
      },
      error: {
        light: '#e57373',
        main: '#f44336',
        dark: '#9A0036',
        contrastText: '#fff',
      },
      success: {
        light: '#81C784',
        main: '#4caf50',
        dark: '#388E3C',
        contrastText: 'rgba(0,0,0,.87)',
      },
      warning: {
        light: '#ffb74d',
        main: '#ff9800',
        dark: '#f57c00',
        contrastText: 'rgba(0,0,0,.87)',
      },
      divider: 'rgba(0,0,0,.12)',
      },
    overrides: {
        MuiListItem: {
          root: {
            "& .MuiSvgIcon-root": {
              fill: "white"
            },
            "&$selected": {
              backgroundColor: '#0971ab',
              color: "white",
              "&:hover": {
                backgroundColor: '#0971ab',
              },
              "& .MuiSvgIcon-root": {
                fill: "white"
              }
            }
          }
        }
      }
  });

export default theme;