import { useRouter } from 'next/router'
import { Link, Box, Grid, Typography, Button, TextField, makeStyles } from '@material-ui/core'
import { isAscii } from 'validator'
import { MainLogo } from '../components'
import { useAPI } from '../contexts/api'

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

const PasswordReset = (props) => {
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

const Right = (props) => {
  const classes = useStyles()
  const router = useRouter()
  const reset = 'reset' in router.query

  const [password1, setPassword1] = React.useState()
  const [password2, setPassword2] = React.useState()
  const [error1, setError1] = React.useState()
  const [error2, setError2] = React.useState()

  const handleChangePassword1 = (e) => {
    setPassword1(e.target.value)
    setError1(validatePassword1(e.target.value))
    setError2(validatePassword2(e.target.value, password2))
  }

  const handleChangePassword2 = (e) => {
    setPassword2(e.target.value)
    setError2(validatePassword2(password1, e.target.value))
  }

  const validatePassword1 = (value) => {
    if (value === null || value === undefined)
      return null
    if (String(value).length < 6)
      return 'Passwords must be at least 6 characters long'
    if (String(value).indexOf(' ') >= 0)
      return 'Passwords may not contain spaces'
    if (!isAscii(value))
      return 'Passwords may not contain special characters such as symbols or accented letters'

    return null
  }

  const validatePassword2 = (value1, value2) => {
    if (value1 != value2)
      return 'Passwords must match'
  }

  return (
    <div>
      <Box pt={"30vh"}>
        <Typography variant="h4" className={classes.title}>
          {reset ? 'Reset' : 'Set'} your password
        </Typography>
      </Box>
      <Box mt={5}>
        <TextField 
          id="password1" 
          type="password" 
          required
          variant="outlined" 
          style={{width:'30vw'}} 
          label="New Password" 
          error={!!error1}
          helperText={error1}
          autoFocus 
          onChange={handleChangePassword1}
        />
      </Box>
      <Box mt={4}>
        <TextField 
          id="password2" 
          type="password" 
          required
          variant="outlined" 
          style={{width:'30vw'}} 
          label="Confirm Password" 
          error={!!error2}
          helperText={error2}
          onChange={handleChangePassword2}
        />
      </Box>
    </div>
  )
}

export default PasswordReset