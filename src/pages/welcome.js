import { useState } from 'react'
import { useMutation } from "react-query"
import { isEmpty, isEmail } from 'validator'
import { Link, Box, Grid, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, LinearProgress, makeStyles } from '@material-ui/core'
import { MainLogo, Wizard } from '../components'
import { useAPI } from '../contexts/api'

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

const Welcome = (props) => {
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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [email, setEmail] = useState()
  const [error, setError] = useState()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState()

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleChangeEmail = async (e) => {
    setEmail(e.target.value)
    setError(await validateEmail(e.target.value))
  }

  const validateEmail = async (value) => {
    if (isEmpty(value))
      return 'This field is required'
    if (!isEmail(value))
      return 'Please enter a valid email address'

    const res = await api.checkEmail(value)
    if (res && !res.email)
      return 'Email address not associated with an account'

    return null
  }

  const [submitFormMutation] = useMutation(
    (email) => api.resetPassword({ email }),
    {
      onSuccess: (resp) => {
        setSubmitting(false)
        setSubmitted(true)
        if (resp !== 'success') 
          setSubmitError(resp)
      },
      onError: (error) => {
        console.log('ERROR', error)
      }
    }
  )

  //TODO move into separate component
  if (forgotPassword) {
    if (isSubmitted && !submitError) {
      return (
        <Box pt={"35vh"} style={{width:'30vw'}}>
          <Typography variant="h5" className={classes.title}>
            We sent an email containing a link to reset your password to
          </Typography>
          <br />
          <Typography variant="h5">
            {email}
          </Typography>
          <br />
          <Typography variant="h5" className={classes.title}>
            Please check your email now.
          </Typography>
          <Box mt={"25vh"}>
            <Link onClick={() => setForgotPassword(false)}>Back to Sign-in/Sign-Up</Link>
          </Box>
        </Box>
      )
    }

    return ( //FIXME use column grid here instead
      <div>
        <Box pt={"30vh"}>
          <Typography variant="h4" className={classes.title}>
            Reset Password
          </Typography>
        </Box>
        <Box mt={4} style={{width:'30vw'}}>
          <Typography variant="button" gutterBottom>
            Enter your email address and we will send you a link to reset your password.
          </Typography>
        </Box>
        <Box mt={4} style={{width:'30vw'}} >
          <TextField 
            id="email" 
            type="email" 
            label="Email" 
            required
            variant="outlined" 
            fullWidth
            error={!!error}
            helperText={error}
            onChange={handleChangeEmail}
          />
          {isSubmitting && <LinearProgress />}
        </Box>
        <Box mt={2} style={{width:'30vw'}}  display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={isSubmitting || !!error || !email}
            onClick={() => {
              console.log('Submit')
              setSubmitting(true)
              setSubmitted(false)
              setSubmitError(false)
              submitFormMutation(email)
            }}
          >
            Submit
          </Button>
        </Box>
        <Box mt={4}>
          <Typography variant="button" color="error">
            {submitError}
          </Typography>
        </Box>
        <Box mt={"25vh"}>
          <Link onClick={() => setForgotPassword(false)}>Back to Sign-in/Sign-Up</Link>
        </Box>
      </div>
    )
  }

  return ( //FIXME use column grid here instead
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
        <Button variant="contained" color="primary" size="large" disableElevation className={classes.button} onClick={handleOpenDialog}>
          Sign Up
        </Button>
      </Box>
      <Box mt={5}>
        <Button variant="outlined" color="primary" size="large" disableElevation className={classes.button} href="/login">
          Login
        </Button>
      </Box>
      <Box pt={1}>
        <Link onClick={() => setForgotPassword(true)}>Forgot Password?</Link>
      </Box>
      <SignUpDialog 
        open={dialogOpen}
        properties={props.properties}
        handleClose={handleCloseDialog} 
        // handleSubmit={handleSubmit}
      />
    </div>
  )
}

const SignUpDialog = ({ open, properties, handleClose }) => {
  const api = useAPI()

  const [form, setForm] = useState(getForm(properties))
  const allFields = form.sections.reduce((acc, s) => acc.concat(s.fields), [])
  const initialValues = 
    allFields.reduce((acc, f) => 
      { 
        acc[f.id.toString()] = ''; 
        return acc 
      }, 
      {}
    )

  // Custom validator
  const validate = async (field, value) => {
    if (field.type == 'username') {
      const res = await api.checkUsername(value)
      //TODO add error checking here
      if (res && res.username)
        return 'Username already taken'
    }
    else if (field.type == 'email') {
      const res = await api.checkEmail(value)
      //TODO add error checking here
      if (res && res.email)
        return 'Email already assigned to an account'
    }

    return null
  }

  // Set region based on country
  const handleSelect = (field, option) => {
    if (field.id == 'country_id') 
      setForm(getForm(properties, option.id))
  }

  const [submitFormMutation] = useMutation(
    (submission) => api.createUser(submission.username, submission),
    {
      //onSuccess: (resp) => {},
      onError: (error) => {
        console.log('ERROR', error)
      }
    }
  )

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Box p={3}>
        <DialogTitle id="form-dialog-title">Create your account</DialogTitle>
        <DialogContent>
          <Wizard
            form={form}
            initialValues={initialValues}
            validate={validate}
            onSelect={handleSelect}
            onSubmit={(values, { setSubmitting }) => {
              console.log('Submit', values)
              submitFormMutation(values)
              setSubmitting(false)
            }}
          />
        </DialogContent>
      </Box>
    </Dialog>
  )
}

const getForm = (properties, countryId) => {
  return {
    sections: [
      { autosave: true,
        fields: [
          { id: "first_name",
            name: "First Name",
            type: "text",
            required: true
          },
          { id: "last_name",
            name: "Last Name",
            type: "text",
            required: true
          },
          { id: "username",
            name: "Username",
            type: "username",
            required: true
          },
          { id: "email",
            name: "Email",
            type: "email",
            required: true
          }
        ]
      },
      { autosave: true,
        fields: [
          { id: "institution",
            name: "Company/Institution",
            type: "text",
            required: true
          },
          { id: "department",
            name: "Department",
            type: "text",
            required: true
          },
          { id: "occupation_id",
            name: "Occupation",
            type: "select",
            required: true,
            options: properties.occupations
          },
          { id: "research_area_id",
            name: "Research Area",
            type: "select",
            required: true,
            options: properties.research_areas
          },
          { id: "funding_agency_id",
            name: "Funding Agency",
            type: "select",
            required: true,
            options: properties.funding_agencies
          }
        ]
      },
      { autosave: true,
        fields: [
          { id: "country_id",
            name: "Country",
            type: "select",
            required: true,
            options: properties.countries
          },
          { id: "region_id",
            name: "Region",
            type: "select",
            required: true,
            options: countryId
              ? properties.regions.filter(r => r.country_id == countryId) // populate based on selected country
              : [ { id: 4585, name: "Please select a country first ..." } ] 
          },
          { id: "gender_id",
            name: "Gender Identity",
            type: "select",
            required: true,
            options: properties.genders
          },
          { id: "ethnicity_id",
            name: "Ethnicity",
            type: "select",
            required: true,
            options: properties.ethnicities
          },
          { id: "aware_channel_id",
            name: "How did you hear about us?",
            type: "select",
            required: true,
            options: properties.aware_channels
          }
        ]
      }
    ]
  }
}

export async function getServerSideProps({ req }) {
  const properties = await req.api.userProperties()
  return { props: { properties } }
}

export default Welcome