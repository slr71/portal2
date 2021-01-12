import React from 'react'
import clsx from 'clsx'
import Link from "next/link"
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Divider, Button, IconButton, Typography, Tooltip, Toolbar, AppBar, Drawer, CssBaseline, Snackbar } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { Close as CloseIcon, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, AccountCircle as PersonIcon } from '@material-ui/icons'
import SideBar from './SideBar'
import TopBar from './TopBar'
import MainLogo from './MainLogo'
import { CustomIntercom } from './CustomIntercom'
import { useUser } from '../contexts/user'
import { useAPI } from '../contexts/api'
import { useError } from '../contexts/error'
import { useCookies } from 'react-cookie'
import { ACCOUNT_UPDATE_REMINDER_COOKIE, WELCOME_BANNER_COOKIE } from '../constants'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  ChevronLeftIcon: {
    color:"white",
  },
  appBar: {
    backgroundColor:'#084060',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    color:'#ffffff',
    backgroundColor: '#212121',
    backgroundImage: "url(/backgroundImages/SidebarPattern.svg)",
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: {
      [theme.breakpoints.down('xs')]: {
        display:'none',},
      ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    backgroundColor: '#EEEEEE',
    maxWidth: '100%',
    [theme.breakpoints.down('md')]:
      {paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
       },
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1), },
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      CyVerse
      {' '}
      {new Date().getFullYear()}
    </Typography>
  )
}

export default function Dashboard(props) {
  const classes = useStyles()
  const [user, setUser] = useUser()
  const api = useAPI()
  const [error, setError] = useError()
  const router = useRouter()

  const [drawerOpen, setDrawerOpen] = React.useState(!user.settings || user.settings.drawerOpen)

  const [cookies, setCookie] = useCookies([ACCOUNT_UPDATE_REMINDER_COOKIE, WELCOME_BANNER_COOKIE])
  const [alertOpen, setAlertOpen] = React.useState(!cookies || !(ACCOUNT_UPDATE_REMINDER_COOKIE in cookies))
  const [welcomeOpen, setWelcomeOpen] = React.useState(!cookies || !(WELCOME_BANNER_COOKIE in cookies))

  const oneYearFromToday = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  const oneYearBeforeToday = new Date(new Date().setFullYear(new Date().getFullYear() - 1))

  const handleCloseAlert = (url) => {
    // Show annual reminder to update account info if at least one year since user joined
    if (new Date(user.date_joined) < oneYearBeforeToday) {
      setCookie(
        ACCOUNT_UPDATE_REMINDER_COOKIE, 
        '', // empty cookie
        { 
          path: '/', 
          expires: oneYearFromToday
        }
      )
    }

    setAlertOpen(false)
    if (url)
      router.push(url)
  }

  const handleCloseWelcome = () => {
    setCookie(
      WELCOME_BANNER_COOKIE, 
      '', // empty cookie
      { 
        path: '/'
      }
    )

    setWelcomeOpen(false)
  }

  // Persist drawer state in user settings
  const handleDrawerEvent = async (open) => {
    setDrawerOpen(open)
    const newUser = await api.updateUser(user.id, { settings: { ...user.settings, drawerOpen: open } })
    setUser(newUser)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            color="inherit"
            onClick={() => handleDrawerEvent(true)}
            className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <MainLogo size="medium" />
          <div style={{flexGrow: 1}} />
          <CustomIntercom />
          <Link href="/account">
            <Tooltip title="Manage your account">
              <Button
                variant="text"
                color="inherit"
                size="large"
                startIcon={<PersonIcon />}
              >
                Account
              </Button>
            </Tooltip>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={() => handleDrawerEvent(false)}>
            <ChevronLeftIcon className={classes.ChevronLeftIcon}/>
          </IconButton>
        </div>
        <Divider />
        <SideBar open={drawerOpen} showStaff={user && user.is_staff}/>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <TopBar title={props.title} breadcrumbs={props.breadcrumbs} back={props.back} actions={props.actions} />
        <Container className={classes.container}>
          {props.children}
          <Box pt={10}>
            <Copyright />
          </Box>
        </Container>
      </main>
      <Snackbar 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={!!error}
      >
        <Alert elevation={6} variant="filled" severity="error" onClose={() => setError(null)}>
          <AlertTitle>
            Oops! An error occurred:
          </AlertTitle>
          {error}
        </Alert>
      </Snackbar>
      {/* <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={alertOpen}
        message="Hi! Please update your Account Information to make sure everything is current."
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={() => handleCloseAlert("/account")}>
              UPDATE
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => handleCloseAlert()}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      /> */}
      <WelcomeDialog 
        open={welcomeOpen}
        handleClose={handleCloseWelcome} 
      />
    </div>
  )
}

//TODO remove someday
const WelcomeDialog = ({ open, handleClose }) => (
  <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle>Welcome to the new User Portal!</DialogTitle>
    <DialogContent style={{fontSize:'1.25em'}}>
      <p>
        The User Portal was redesigned for improved robustness and ease of use.  Let us know how we did (see "help" button) and if you have any bug reports, questions, or suggestions.
      </p>
      <p>
        If you are new here check out this resource for getting started:<br />
        <a href="https://learning.cyverse.org" target="_blank">https://learning.cyverse.org</a>
      </p>
      <br />
    </DialogContent>
    <DialogActions>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleClose}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
)