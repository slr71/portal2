import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Grid, Switch, Button, Typography, Divider } from '@material-ui/core'
import { Layout, FormField } from '../components'
import { useUser } from '../contexts/user'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  },
  box: {
    marginBottom: '4em'
  }
}))

const Account = props => {
  const classes = useStyles()
  const user = useUser()

  return (
    <Layout title="Account">
      <Container maxWidth='md'>
          {forms({user, ...props}).map(form =>
            <Box key={form.title} className={classes.box}>
              <Form {...form}></Form>
              <Button variant="contained" color="primary" size="medium">
                Update
              </Button> 
            </Box>
          )}
      </Container>
    </Layout>
  )
}

const EmailForm = ({ user }) => (
  <div>
    {user.emails.map(email => (
      <div key={email.email}>
        <Divider />
        <Typography>{email.email}</Typography>
        <Typography color="textSecondary" gutterBottom>
          {[email.verified ? 'Verified' : '', email.primary ? 'Primary' : ''].join(', ')}
        </Typography>
      </div>
    ))}
  </div>
)

const MailingListForm = ({ user }) => (
  <div>
    {user.emails.map(email => (
      <div key={email.email}>
        <Divider />
        {email.mailing_lists.map(list => (
          <Box display='flex' key={list.id}>
            <Typography color="textSecondary" gutterBottom>{list.name}</Typography>
            <Switch
              checked={true}
              name="checkedA"
            />
          </Box>
        ))}
      </div>
    ))}
  </div>
)

const Form = props => {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography component="div" variant="h5">{props.title}</Typography>
      <Typography color="textSecondary">{props.subtitle}</Typography>
      {props.render ?
        props.render :
        <Grid container spacing={4}>
          {props.fields.map(field =>
            <Grid item key={field.id} xs={field.width ? field.width : 12}>
              <FormField {...field}></FormField>
            </Grid>
          )}
        </Grid>
      }
    </Paper>
  )
}

const forms = ({ user, properties }) => ([
  { title: "Identification",
    fields: [
      { id: "first_name",
        name: "First Name",
        required: true,
        width: 6,
        value: user.first_name
      },
      { id: "last_name",
        name: "Last Name",
        required: true,
        width: 6,
        value: user.last_name
      },
      { id: "username",
        name: "Username",
        description: "Your username cannot be changed",
        value: user.username,
        disabled: true
      },
      { id: "orcid",
        name: "ORCID",
        description: (<span>Persistent digital identifier that distinguishes you from every other researcher (<a href="https://orcid.org" target="_blank">https://orcid.org</a>)</span>),
        value: user.orcid_id
      }
    ]
  },
  { title: "Password",
    fields: [
      { id: "old_password",
        name: "Old Password",
        required: true
      },
      { id: "new_password",
        name: "New Password",
        required: true
      },
      { id: "confirm_password",
        name: "Confirm New Password",
        required: true
      }
    ]
  },
  { title: "Email",
    subtitle: "Email addresses associated with this account",
    render: <EmailForm user={user} />
  },
  { title: "Mailing List Subscriptions",
    subtitle: "Manage which services you would like to receive maintenance-related emails from",
    render: <MailingListForm user={user} />
  },
  { title: "Institution",
    fields: [
      { id: "company",
        name: "Company/Institution",
        required: true,
        value: "Not Provided"
      },
      { id: "department",
        name: "Department",
        required: true,
        value: "Not Provided"
      },
      { id: "occupation",
        name: "Occupation",
        required: true,
        value: "Not Provided",
        options: properties.occupations
     },
      { id: "country",
        name: "Country",
        required: true,
        value: "Not Provided",
        options: properties.countries
      },
      { id: "region",
        name: "Region",
        required: true,
        value: "Not Provided"
      }
    ]
  },
  { title: "Research",
    fields: [
      { id: "research_area",
        name: "Research Area",
        required: true,
        value: "Not Provided",
        options: properties.research_areas
      },
      { id: "funding_agency",
        name: "Funding Agency",
        required: true,
        value: "Not Provided",
        options: properties.funding_agencies
      }
    ]
  },
  { title: "Demographics",
    fields: [
      { id: "gender",
        name: "Gender Identity",
        required: true,
        value: "Not Provided",
        options: properties.genders
      },
      { id: "ethnicity",
        name: "Ethnicity",
        required: true,
        value: "Not Provided",
        options: properties.ethnicities
      },
      { id: "aware",
        name: "How did you hear about us?",
        required: true,
        value: "Not Provided",
        options: properties.aware_channels
      }
    ]
  }
])

export async function getServerSideProps({ req }) {
  const properties = await req.api.userProperties()

  return { props: { properties } }
}

export default Account