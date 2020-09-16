import { Link, Box, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, makeStyles } from '@material-ui/core'
import { RssFeedOutlined } from '@material-ui/icons'
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
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

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
        <Link href="">Forgot Password?</Link>
      </Box>
      <SignUpDialog 
        open={dialogOpen}
        properties={props.properties}
        // handleChange={handleChangeAnswer}
        // handleClose={handleCloseDialog} 
        // handleSubmit={handleSubmit}
      />
    </div>
  )
}

const SignUpDialog = ({ open, properties, handleChange, handleClose, handleSubmit }) => {
  const api = useAPI()

  // Custom validator for username
  const validate = async (field, value) => {
    if (field.type == 'username') {
      const res = await api.checkUsername(value)
      //TODO add error checking here
      console.log('foo', res)
      if (res && res != 'success')
        return res
    }

    return null
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth aria-labelledby="form-dialog-title">
      <Box p={3}>
        <DialogTitle id="form-dialog-title">Create your account</DialogTitle>
        <DialogContent>
          <Wizard
            form={form(properties)}
            initialValues={{}}
            validate={validate}
            onSubmit={(values, { setSubmitting }) => {
              console.log('Submit!!!')
              //submitFormMutation(formatSubmission(values))
              setSubmitting(false)
            }}
          />
        </DialogContent>
      </Box>
    </Dialog>
  )
}

const form = (properties) => {
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
            options: properties.regions
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