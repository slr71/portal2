import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Grid, Switch, Typography, Divider } from '@material-ui/core'
import { Layout, FormField } from '../components'
import PortalAPI from '../api'

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

  return (
    <Layout title="Account" {...props}>
      <Container maxWidth='md'>
          {forms({...props}).map(form =>
            <Box key={form.title} className={classes.box}>
              <Form {...form}></Form>
            </Box>
          )}
      </Container>
    </Layout>
  )
}

const EmailForm = props => (
  <div>
    {props.user.emails.map(email => (
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

const MailingListForm = props => (
  <div>
    {props.user.emails.map(email => (
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

const forms = props => ([ // expects { user, properties }
  { title: "Identification",
    fields: [
      { id: "first_name",
        name: "First Name",
        required: true,
        width: 6,
        value: props.user.first_name
      },
      { id: "last_name",
        name: "Last Name",
        required: true,
        width: 6,
        value: props.user.last_name
      },
      { id: "username",
        name: "Username",
        description: "Your username cannot be changed",
        value: props.user.username,
        disabled: true
      },
      { id: "orcid",
        name: "ORCID",
        description: (<span>Persistent digital identifier that distinguishes you from every other researcher (<a href="https://orcid.org" target="_blank">https://orcid.org</a>)</span>),
        value: props.user.orcid_id
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
    render: <EmailForm user={props.user} />
  },
  { title: "Mailing List Subscriptions",
    subtitle: "Manage which services you would like to receive maintenance-related emails from",
    render: <MailingListForm user={props.user} />
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
        options: props.properties.occupations
     },
      { id: "country",
        name: "Country",
        required: true,
        value: "Not Provided",
        options: props.properties.countries
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
        options: props.properties.research_areas
      },
      { id: "funding_agency",
        name: "Funding Agency",
        required: true,
        value: "Not Provided",
        options: props.properties.funding_agencies
      }
    ]
  },
  { title: "Demographics",
    fields: [
      { id: "gender",
        name: "Gender Identity",
        required: true,
        value: "Not Provided",
        options: props.properties.genders
      },
      { id: "ethnicity",
        name: "Ethnicity",
        required: true,
        value: "Not Provided",
        options: props.properties.ethnicities
      },
      { id: "aware",
        name: "How did you hear about us?",
        required: true,
        value: "Not Provided",
        options: props.properties.aware_channels
      }
    ]
  }
])

export async function getServerSideProps({ req }) {
  const api = new PortalAPI({req})
  const user = await api.user() //FIXME move user request into React context
  const properties = await api.userProperties()

  return { props: { user, properties } }
}

export default Account