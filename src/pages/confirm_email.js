import { Grid, Box, Button, Typography, makeStyles } from '@material-ui/core'
import { MainLogo } from '../components'

//FIXME Duplicated in welcome.js
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

const ConfirmEmail = (props) => {
  const classes = useStyles()

  return (
    <div>
      <Grid container direction="row">
        <Grid item align="center" className={classes.grid} style={{backgroundColor: '#0971ab'}}>
          <Left {...props} />
        </Grid>
        <Grid item align="center" className={classes.grid}>
          <Right {...props} />
        </Grid>
      </Grid>
    </div>
  )
}

//FIXME Duplicated in welcome.js
const Left = () => {
  return (
    <div>
      <Box pt={"30vh"}>
        <MainLogo size="large" />
      </Box>
      <Box pt={"2em"} p={"6em"}>
        <Typography variant="h5" style={{color: "white"}}>
          The Open Science Workspace for
          <br />
          Collaborative Data-driven Discovery
        </Typography>
      </Box>
    </div>
  )
}

const Right = ({ confirmed, response }) => {
  const classes = useStyles()
  const message = confirmed
    ? <>Thanks! Your email address was confirmed.<br /><br />Please sign in to continue.</>
    : <>An error occurred: {response}</>

  return (
    <div>
      <Box pt={"30vh"} style={{width:'30vw'}} >
        <Typography variant="h4" className={classes.title}>
          {message}
        </Typography>
      </Box>
      <Box mt={5}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          display="flex" 
          href="/login"
        >
          Sign In
        </Button>
      </Box>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  // Require "code" query param
  if (!req.query.code)
    res.redirect('/')

  const resp = await req.api.confirmEmailAddress(req.query.code)

  return { 
    props: { 
      confirmed: resp === 'success',
      response: resp
    } 
  }
}

export default ConfirmEmail