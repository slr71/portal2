import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0971ab',
    },
    secondary: {
      main: '#89e2fa',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  background: {
    default: '#fff',
  },
}

const theme = createMuiTheme({
  palette: palette,
  overrides: {
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: palette.primary.main,
          color: "white",
          "&:hover": {
            backgroundColor: palette.primary.main,
          },
          "& .MuiSvgIcon-root": {
            fill: "white"
          }
        }
      }
    }
  }
})

export default theme;