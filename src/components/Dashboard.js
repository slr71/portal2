import React from 'react'
import clsx from 'clsx'
import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Button, Divider, IconButton, Typography, Toolbar, AppBar, Drawer, CssBaseline } from '@material-ui/core'
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Person as PersonIcon } from '@material-ui/icons'
import SideBar from './SideBar'
import TopBar from './TopBar'
import { useUser } from '../contexts/user'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      CyVerse
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

function Logo() {
  return <img src="/cyverse_upLogo_white.svg" alt="CyVerse Logo" className={useStyles().mainLogo}/>
}


const drawerWidth = 200

const useStyles = makeStyles((theme) => ({
mainLogo: {
  width:'13em',
},

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
  title: {
    flexGrow: 1,
    visibility:'hidden',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    color:'#ffffff',
    backgroundColor: 'rgb(6, 20, 53)',
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
  appBarSpacer: theme.mixins.toolbar,
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

export default function Dashboard(props) {
  const classes = useStyles()
  const user = useUser()

  const [open, setOpen] = React.useState(true)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            color="inherit"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Logo />
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            CyVerse User Portal
          </Typography>
          <Link href="/account">
            <Button
              variant="text"
              color="inherit"
              startIcon={<PersonIcon />}
            >
              My Account
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon className={classes.ChevronLeftIcon}/>
          </IconButton>
        </div>
        <Divider />
        <SideBar open={open} showStaff={user && user.is_staff}/>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <TopBar title={props.title} actions={props.actions} />
        <Container maxWidth="lg" className={classes.container}>
          {props.children}
          <Box pt={10}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  )
}
