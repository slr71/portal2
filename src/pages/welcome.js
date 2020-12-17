import { useState } from 'react'
import { useRouter } from 'next/router'
import { isEmpty, isEmail } from 'validator'
import { Link, Box, Grid, Typography, TextField, Button, LinearProgress, makeStyles} from '@material-ui/core'
import { MainLogo, Wizard, WelcomeAnimation, honeypotId } from '../components'
import { useAPI } from '../contexts/api'
import { generateHMAC } from '../api/lib/hmac'
import { sortCountries } from '../lib/misc'
const properties = require('../user-properties.json')

const useStyles = makeStyles((theme) => ({
  grid: {
    height: "100vh",
    width: "50vw",
  },
  button: {
    width: "17vw",
    whiteSpace: 'nowrap',
    minWidth: '10em'
  },
  title: {
    color: '#0971ab',
    fontWeight: "bold"
  },
}))

const Welcome = (props) => {
  const classes = useStyles()

  return (
    <div>
      <Grid container>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} align="center" className={classes.grid} style={{backgroundColor: '#0971ab'}}>
          <Left {...props} />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} align="center" className={classes.grid} style={{backgroundColor: '#ffffff'}}>
          <Right {...props} />
        </Grid>
      </Grid>
    </div>
  )
}

const Left = () => (
  <div>
    <Box pt={"15%"}>
      <MainLogo size="large" />
    </Box>
    <Box>
      <WelcomeAnimation />
    </Box>
      <Box>
        <Typography variant="h5" style={{color: "white"}}>
          The Open Science Workspace for
          <br />
          Collaborative Data-driven Discovery
        </Typography>
      </Box>
  </div>
)

const Right = (props) => {
  const classes = useStyles()
  const router = useRouter()

  const [signup, setSignup] = useState(!!router.query.signup)
  const [forgotPassword, setForgotPassword] = useState(false)

  if (forgotPassword)
    return <ForgotPassword cancelHandler={() => setForgotPassword(false)} />

  if (signup)
    return <SignUp {...props} />

  return ( //FIXME use column grid here instead
    <div>
      <Box pt={"30%"}>
        <Typography variant="h4" className={classes.title}>
          Welcome to CyVerse!
        </Typography>
      </Box>
      <Box pt={"5em"}>
        <Typography variant="h6" gutterBottom>
          New to CyVerse?
        </Typography>
      </Box>
      <Box mt={2}>
        <Button variant="contained" color="primary" size="large" disableElevation className={classes.button} onClick={() => setSignup(true)}>
          Sign Up
        </Button>
      </Box>
      <Box mt={3}>
        <Button variant="outlined" color="primary" size="large" disableElevation className={classes.button} href="/login">
          Login
        </Button>
      </Box>
      <Box mt={2} mb={5}>
        <Button variant="text" size="small" onClick={() => setForgotPassword(true)}>Forgot Password</Button>
      </Box>
    </div>
  )
}

const ForgotPassword = ({ cancelHandler }) => {
  const classes = useStyles()
  const api = useAPI()

  const [email, setEmail] = useState()
  const [validationError, setValidationError] = useState()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState()

  const handleChangeEmail = async (e) => {
    setEmail(e.target.value)
    setValidationError(await validateEmail(e.target.value))
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

  const submitForm = async (email) => {
    try {
      const resp = await api.resetPassword({ email })
      setSubmitting(false)
      setSubmitted(true)
      if (resp !== 'success') 
        setSubmitError(resp)
    }
    catch(error) {
      console.log(error)
      setSubmitError(error.message)
    }
  }

  const backButton = <Link onClick={cancelHandler}>Back to Sign-in / Sign-Up</Link>

  if (isSubmitted && !submitError) {
    return (
      <Box pt={"35vh"} style={{width:'30vw'}}>
        <Typography variant="h5" color="primary">
          We sent an email containing a link to reset your password to
        </Typography>
        <br />
        <Typography variant="h5">
          {email}
        </Typography>
        <br />
        <Typography variant="h5" color="primary">
          Please check your email now.
        </Typography>
        <br />
        <br />
        {backButton}
      </Box>
    )
  }

  return ( //FIXME use column grid here instead
    <Box width="60%" pt={"30%"}>
      <Typography variant="h4" className={classes.title}>
        Reset Password
      </Typography>
      <Box mt={5}>
        <Typography variant="button" gutterBottom>
          Enter your email address and we will send you a link to reset your password.
        </Typography>
        </Box>
      <Box mt={4}>
        <TextField 
          id="email" 
          type="email" 
          label="Email" 
          required
          variant="outlined" 
          fullWidth
          error={!!validationError}
          helperText={validationError}
          onChange={handleChangeEmail}
        />
        {isSubmitting && <LinearProgress />}
      </Box>
      <Box mt={1} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          disabled={isSubmitting || !!validationError || !email}
          onClick={() => {
            console.log('Submit')
            setSubmitting(true)
            setSubmitted(false)
            setSubmitError(false)
            submitForm(email)
          }}
        >
          Submit
        </Button>
      </Box>
      <br />
      <Typography variant="button" color="error">
        {submitError}
      </Typography>
      <br />
      <br />
      {backButton}
    </Box>
  )
}

const SignUp = ({ startTime, firstNameId, lastNameId }) => {
  const classes = useStyles()
  const api = useAPI()
  const [error, setError] = useState()

  const [form, setForm] = useState(getForm(firstNameId, lastNameId))
  const [isSubmitted, setSubmitted] = useState(false)
  const [user, setUser] = useState() // newly created user

  const allFields = form.sections.reduce((acc, s) => acc.concat(s.fields), [])
  const initialValues = 
    allFields.reduce((acc, f) => { 
        acc[f.id.toString()] = ''; 
        return acc 
      }, 
      {}
    )

  // Custom validator for username & email fields
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
      setForm(getForm(firstNameId, lastNameId, option.id))
  }

  const submitForm = async (submission) => {
    try {
      const newUser = await api.createUser(submission)
      if (!newUser || typeof newUser != 'object')
        setError('An error occurred')
      else {
        setUser(newUser)
        setSubmitted(true)
      }
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  return (
    <Box width="60%" pt={"25%"}>
        {isSubmitted 
        ? <Box p={7}>
            <Typography variant='h5' color='textSecondary'>
              A confirmation email was sent to
            </Typography>
            <br /><br />
            <Typography variant='h5' color='primary'>		  
              <b>{user ? user.email : '<error>'}</b>
            </Typography>
            <br /><br />
            <Typography variant='h5' color='textSecondary'>
              Please click on the confirmation link in the email to activate your account.
            </Typography>
          </Box>
        : <Box>
            <Typography variant="h4" className={classes.title}>Create your account</Typography>
            <br />
            <Wizard
              form={form}
              initialValues={initialValues}
              validate={validate}
              onSelect={handleSelect}
              onSubmit={(values, { setSubmitting }) => {
                values['plt'] = startTime // encrypted page load time
                console.log('Submit', values)
                submitForm(values)
                setSubmitting(false)
              }}
            />
            <br />
            {error && <Typography variant="button" color="error">{error}</Typography>}
            <br />
            <Link href="/login">Already have an account?</Link>
          </Box>
        }
    </Box>
  )
}

const getForm = (firstNameId, lastNameId, countryId) => {
  return {
    sections: [
      { autosave: true,
        fields: [
          { id: firstNameId, 
            honeypot: true, // tells Wizard to generate a duplicate honey pot field
            name: "First Name",
            type: "text",
            required: true
          },
          { id: lastNameId,
            honeypot: true, // tells Wizard to generate a duplicate honey pot field
            name: "Last Name",
            type: "text",
            required: true,
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
            type: "autocomplete",
            required: true,
            options: properties.countries.sort(sortCountries)
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

export async function getServerSideProps() {
  const startTime = generateHMAC(Date.now())
  const firstNameId = honeypotId(1)
  const lastNameId = honeypotId(2)

  return { 
    props: { 
      startTime,
      firstNameId,
      lastNameId
    } 
  }
}

export default Welcome
