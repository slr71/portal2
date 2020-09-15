import { Link, Box, Grid, Typography, Button, makeStyles } from '@material-ui/core'
import MainLogo from '../components/MainLogo'

const useStyles = makeStyles((theme) => ({
  grid: {
    height: "100vh",
    width: "50vw",
  },
  button: {
    width: "25vw"
  },
  title: {
    color: '#0971ab',
    fontWeight: "bold"
  }
}))

const Welcome = () => {
  const classes = useStyles()

  return (
    <div>
      <Grid container direction="row">
        <Grid item align="center" className={classes.grid} style={{backgroundColor: '#0971ab'}}>
          <Left />
        </Grid>
        <Grid item align="center" className={classes.grid}>
          <Right />
        </Grid>
      </Grid>
    </div>
  )
}

const Left = () => {
  const classes = useStyles()

  return (
    <div>
      <Box pt={"30vh"}>
        <MainLogo size="large" />
      </Box>
      <Box pt={"2em"} p={"6em"}>
        <Typography variant="h5" style={{color: "white"}}>
          An Open Science Workspace for Collaborative Data-driven Discovery
        </Typography>
      </Box>
    </div>
  )
}

const Right = () => {
  const classes = useStyles()

  return (
    <div>
      <Box pt={"30vh"}>
        <Typography variant="h4" className={classes.title}>
          Welcome to CyVerse!
        </Typography>
      </Box>
      <Box pt={"5em"}>
        <Typography variant="button" gutterBottom>
          New to CyVerse?
        </Typography>
      </Box>
      <Box>
        <Button variant="contained" color="primary" size="large" disableElevation className={classes.button}>
          Sign Up
        </Button>
      </Box>
      <Box mt={5}>
        <Button variant="outlined" color="primary" size="large" disableElevation className={classes.button} href="/login">
          Login
        </Button>
      </Box>
      <Box pt={1}>
        <Link href="">Forgot Password?</Link>
      </Box>
    </div>
  )
}

export default Welcome