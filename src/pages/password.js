import { useState } from 'react'
import { useMutation } from "react-query"
import { useAPI } from '../contexts/api'
import { Box, Grid, Typography, Button, TextField, makeStyles } from '@material-ui/core'
import { MainLogo } from '../components'
import { validatePassword } from '../lib/misc'

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
  const api = useAPI()
  const reset = 'reset' in props
  const hmac = props.code
  const setLabel = reset ? 'Reset' : 'Set'

  const [password1, setPassword1] = useState()
  const [password2, setPassword2] = useState()
  const [error1, setError1] = useState()
  const [error2, setError2] = useState()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitted, setSubmitted] = useState(false)

  const handleChangePassword1 = (e) => {
    setPassword1(e.target.value)
    setError1(validatePassword(e.target.value))
    setError2(validatePassword2(e.target.value, password2))
  }

  const handleChangePassword2 = (e) => {
    setPassword2(e.target.value)
    setError2(isMatching(password1, e.target.value))
  }

  const validatePassword2 = (value1, value2) => {
    if (value1 != value2)
      return 'Passwords must match'
  }

  const [submitFormMutation] = useMutation(
    (password) => api.updatePassword({ hmac, password }),
    {
      onSuccess: (resp) => {
        setSubmitted(true)
      },
      onError: (error) => {
        console.log('ERROR', error)
      }
    }
  )

  if (isSubmitted) {
    return (
      <div>
        <Box pt={"30vh"}>
          <Typography variant="h4" className={classes.title}>
            Your password was updated.<br />Please sign in to continue.
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

  return ( //FIXME use column grid here instead
    <div>
      <Box pt={"30vh"}>
        <Typography variant="h4" className={classes.title}>
          {setLabel} your password
        </Typography>
      </Box>
      <Box mt={5}>
        <TextField 
          id="password1" 
          type="password" 
          required
          variant="outlined" 
          style={{width:'30vw'}} 
          label="Password" 
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
      <Box mt={4} style={{width:'30vw'}} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          display="flex" 
          disabled={isSubmitting || !!error1 || !!error2}
          onClick={() => {
            console.log('Submit')
            setSubmitting(true)
            submitFormMutation(password1)
            //setSubmitting(false)
          }}
        >
          {setLabel} Password
        </Button>
      </Box>
    </div>
  )
}

export async function getServerSideProps(context) {
  const props = context.req.query

  // Require "code" query param
  if (!props.code)
    context.res.redirect('/')

  return { props }
}

export default PasswordReset