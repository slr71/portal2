import { useMutation } from "react-query"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Switch, Typography, Button, Divider, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import { Person as PersonIcon } from '@material-ui/icons'
import { Layout, UpdateForm } from '../components'
import { useUser } from '../contexts/user'
import { useAPI } from '../contexts/api'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em'
  },
  box: {
    marginBottom: '4em'
  },
}))

const Account = ({ properties }) => {
  const classes = useStyles()
  const api = useAPI()
  const user = useUser()
  const forms = Forms(user, properties)

  const initialValues = (fields) =>
      fields.reduce((acc, f) => { acc[f.id] = f.value; return acc }, {})

  const [submitFormMutation] = useMutation(
    (submission) => api.updateUser(user.id, submission),
    {
        onSuccess: (resp, { onSuccess }) => {
            console.log('SUCCESS')
            // onSuccess(resp);
        },
        onError: (error, { onError }) => {
          console.log('ERROR', error)
            // onError(error);
            // setSubmissionError(error);
        },
    }
  )

  const title = 
    <div style={{display: 'flex', alignItems: 'center'}}>
      <PersonIcon fontSize="large" style={{marginRight: "0.25em"}}/>Account
    </div>

  const logoutButton =
    <Button variant="contained" color="primary" href="/logout">Sign Out</Button>

  return (
    <Layout title={title} actions={logoutButton}>
      <Container maxWidth='md'>
        <br />
        {forms.map((form, index) => (
          <Box key={index} className={classes.box}>
            <Paper elevation={3} className={classes.paper}>
              {form.render ||
                <UpdateForm 
                  title={form.title}
                  subtitle={form.subtitle}
                  fields={form.fields} 
                  initialValues={initialValues(form.fields)} 
                  autosave={form.autosave}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      console.log('Submit:', values)
                      submitFormMutation(values)
                      setSubmitting(false)
                    }, 1000)
                  }}
                />
              }
            </Paper>
          </Box>
        ))}
      </Container>
    </Layout>
  )
}

const EmailForm = ({ user }) => (
  <div>
    {user.emails.map(email => (
      <Box key={email.email} pt={2}>
        <Divider />
        <List>
          <ListItem>
            <ListItemText 
              primary={email.email} 
              secondary={[email.verified ? 'Verified' : '', email.primary ? 'Primary' : ''].join(', ')} 
            />
          </ListItem>
        </List>
      </Box>
    ))}
    <Divider />
    <Box display="flex" justifyContent="flex-end" pt={2}>
      <Button
        variant="contained"
        color="primary"
      >
        Add Email Address
      </Button>
    </Box>
  </div>
)

const MailingListForm = ({ user }) => (
  <div>
    {user.emails.map(email => (
      <Box key={email.email} pt={2}>
        <Divider />
        <List>
          <ListItem>
            <Typography variant="subtitle2" color="textSecondary">{email.email}</Typography>
          </ListItem>
          {email.mailing_lists.map(list => (
            <ListItem key={list.id}>
              <ListItemText primary={list.name} />
              <ListItemSecondaryAction>
                <Switch
                  checked={true}
                  name="checkedA"
                  color="primary"
                  variant="caption"
                  edge="end"
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    ))}
  </div>
)

const Forms = (user, properties) => {
  return [ 
    { title: "Identification",
      autosave: true,
      fields: [
        { id: "first_name",
          name: "First Name",
          type: "text",
          required: true,
          width: 6,
          value: user.first_name
        },
        { id: "last_name",
          name: "Last Name",
          type: "text",
          required: true,
          width: 6,
          value: user.last_name
        },
        { id: "username",
          name: "Username",
          description: "Your username cannot be changed",
          type: "text",
          value: user.username,
          disabled: true
        },
        { id: "orcid_id",
          name: "ORCID",
          description: <span>Persistent digital identifier that distinguishes you from every other researcher (<a href="https://orcid.org" target="_blank">https://orcid.org</a>)</span>,
          type: "text",
          value: user.orcid_id
        }
      ]
    },
    { title: "Password",
      autosave: false,
      fields: [
        { id: "old_password",
          name: "Old Password",
          type: "password",
          required: true
        },
        { id: "new_password",
          name: "New Password",
          type: "password",
          required: true
        },
        { id: "confirm_password",
          name: "Confirm New Password",
          type: "password",
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
      autosave: true,
      fields: [
        { id: "institution",
          name: "Company/Institution",
          type: "text",
          required: true,
          value: user.institution,
        },
        { id: "department",
          name: "Department",
          type: "text",
          required: true,
          value: user.department
        },
        { id: "occupation_id",
          name: "Occupation",
          type: "select",
          required: true,
          value: user.occupation.id,
          options: properties.occupations
      },
        { id: "country_id",
          name: "Country",
          type: "select",
          required: true,
          value: user.region.country_id,
          options: properties.countries
        },
        { id: "region_id",
          name: "Region",
          type: "select",
          required: true,
          value: user.region.id,
          options: properties.regions.filter(r => r.country_id == user.region.country_id)
        }
      ]
    },
    { title: "Research",
      autosave: true,
      fields: [
        { id: "research_area_id",
          name: "Research Area",
          type: "select",
          required: true,
          value: user.research_area.id,
          options: properties.research_areas
        },
        { id: "funding_agency_id",
          name: "Funding Agency",
          type: "select",
          required: true,
          value: user.funding_agency.id,
          options: properties.funding_agencies
        }
      ]
    },
    { title: "Demographics",
      autosave: true,
      fields: [
        { id: "gender_id",
          name: "Gender Identity",
          type: "select",
          required: true,
          value: user.gender.id,
          options: properties.genders
        },
        { id: "ethnicity_id",
          name: "Ethnicity",
          type: "select",
          required: true,
          value: user.ethnicity.id,
          options: properties.ethnicities
        },
        { id: "aware_channel_id",
          name: "How did you hear about us?",
          type: "select",
          required: true,
          value: user.aware_channel.id,
          options: properties.aware_channels
        }
      ]
    }
  ]
}

export async function getServerSideProps({ req }) {
  const properties = await req.api.userProperties()
  return { props: { properties } }
}

export default Account