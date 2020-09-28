import { useMutation } from "react-query"
import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Switch, Typography, Link, Button, IconButton, TextField, Avatar, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { Person as PersonIcon, Mail as MailIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { Layout, UpdateForm } from '../components'
import { isEmail, isEmpty } from 'validator'
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

  // Default submit handler for forms
  const [submitFormMutation] = useMutation(
    (submission) => api.updateUser(user.id, submission),
    {
      //onSuccess: (resp) => {},
      onError: (error) => {
        console.log('ERROR', error)
      }
    }
  )

  const title = 
    <div style={{display: 'flex', alignItems: 'center'}}>
      <PersonIcon fontSize="large" style={{marginRight: "0.25em"}}/>Account
    </div>

  const logoutButton =
    <Button variant="contained" color="primary" href="/logout">Sign Out</Button>

  const validate = (field, value, values) => {
    if (field.id == 'confirm_password' && value != values['new_password'])
      return 'Passwords must match'
  }

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
                  validate={validate}
                  autosave={form.autosave}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      console.log('Submit:', values)
                      if (form.submitHandler)
                        form.submitHandler(values)
                      else
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

const EmailForm = ({ user, title, subtitle }) => {
  const api = useAPI()
  const [emails, setEmails] = useState(user.emails)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [emailToAdd, setEmailToAdd] = useState('')
  const [error, setError] = useState()

  const handleChangeEmail = async (event) => {
    setEmailToAdd(event.target.value)
    setError(await validateEmail(event.target.value))
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const validateEmail = async (value) => {
    if (!isEmail(value))
      return 'A valid email address is required'

    const res = await api.checkEmail(value)
    console.log(res)
    //TODO add error checking here
    if (res && res.email)
      return 'Email already assigned to an account'

    return null
  }

  const [handleSubmitEmail] = useMutation(
    () => api.createEmailAddress({ email: emailToAdd }),
    {
      onSuccess: async (resp) => {
        setEmails(emails.concat(resp))
        handleCloseDialog()
      },
      onError: (error) => {
        console.log('ERROR', error)
      }
    }
  )

  const [handleResendConfirmationEmail] = useMutation(
    (email) => api.createEmailAddress({ email: email.email }),
    {
      onSuccess: async (resp, email) => {
        const newEmails = emails.map(email2 => {
          return {...email2, sent: (email2.email == email.email) } 
        })
        setEmails(newEmails)
        handleCloseDialog()
      },
      onError: (error) => {
        console.log('ERROR', error)
      }
    }
  )

  const [handleRemoveEmailAddress] = useMutation(
    (id) => api.deleteEmailAddress(id),
    {
      onSuccess: async (resp, id) => {
        const newEmails = emails.filter(email => email.id != id)
        setEmails(newEmails)
        handleCloseDialog()
      },
      onError: (error) => {
        console.log('ERROR', error)
      }
    }
  )

  const statusMsg = (email) => email.verified 
    ? 'Verified' + (email.primary ? ', Primary' : '')
    : <>
        A confirmation email has been sent. 
        Click on the link in the email to verify that this is your address.<br />
        {email.sent 
          ? '[ Sent! ]'
          : <Link onClick={() => handleResendConfirmationEmail(email)}>[ Resend Confirmation Email ]</Link>
        }
      </>

  return (
    <div>
      <Box>
        <Typography component="div" variant="h5">{title}</Typography>
        <Typography color="textSecondary" gutterBottom>{subtitle}</Typography>
        <List>
          {emails.map(email => (
            <ListItem key={email.id}>
              <ListItemAvatar>
                <Avatar>
                  <MailIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={email.email} 
                secondary={statusMsg(email)} 
              />
              {!email.primary &&
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveEmailAddress(email.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              }
            </ListItem>
          ))}
        </List>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Add Email Address
        </Button>
      </Box>
      <AddEmailAddressDialog 
        open={dialogOpen}
        error={error}
        handleChange={handleChangeEmail}
        handleClose={handleCloseDialog} 
        handleSubmit={!isEmpty(emailToAdd) && !error ? handleSubmitEmail : null}
      />
    </div>
  )
}

const AddEmailAddressDialog = ({ open, error, handleChange, handleClose, handleSubmit }) => (
  <Dialog open={open} onClose={handleClose} fullWidth aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Add Email Address</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Enter the email address to add to your account.
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        fullWidth
        id="name"
        type="email"
        error={!!error}
        helperText={error}
        onChange={handleChange}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} variant="outlined">
        Cancel
      </Button>
      <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!handleSubmit}>
        Add
      </Button>
    </DialogActions>
  </Dialog>
)

const MailingListForm = ({ user, title, subtitle }) => {
  return (
    <div>
      <Typography component="div" variant="h5">{title}</Typography>
      <Typography color="textSecondary" gutterBottom>{subtitle}</Typography>
      {user.emails.map(email => (
        <Box key={email.id}>
          <List>
            {user.emails.length > 1 &&
            <ListItem>
              <Typography variant="subtitle2" color="textSecondary">{email.email}</Typography>
            </ListItem>
            }
            {email.mailing_lists.map(list => (
              <MailingListItem key={list.id} email={email} list={list} />
            ))}
          </List>
        </Box>
      ))}
    </div>
  )
}

const MailingListItem = ({ email, list }) => {
  const api = useAPI()

  const [state, setState] = useState(list.api_emailaddressmailinglist.is_subscribed) //FIXME ugly, alias api_emailaddressmailinglist in api query

  const handleChange = (event) => {
    console.log(state, email.id, event.target.name, event.target.checked)
    setState(event.target.checked)
  }

  useEffect(() => {
      api.updateMailingListSubscription({ 
        id: list.id,
        email: email.email,
        subscribe: state
      }).then((resp) => {
        console.log(resp)
      })
    },
    [state]
  )

  return (
    <ListItem key={list.id}>
      <ListItemText primary={list.name} />
      <ListItemSecondaryAction>
        <Switch
          checked={state} 
          name={list.id.toString()}
          color="primary"
          variant="caption"
          edge="end"
          onChange={handleChange}
        />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

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
      submitHandler: (values) => {
        // const [submitPasswordMutation] = useMutation(
        //   (submission) => api.updateUser(user.id, submission),
        //   {
        //     onSuccess: (resp) => {
        //     },
        //     onError: (error) => {
        //       console.log('ERROR', error)
        //     }
        //   }
        // )
        // return submitPasswordMutation;
      },
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
    { render: 
        <EmailForm 
          user={user} 
          title="Email" 
          subtitle="Email addresses associated with this account" 
        />
    },
    { render: 
        <MailingListForm 
          user={user} 
          title="Mailing List Subscriptions" 
          subtitle="Manage which services you would like to receive maintenance-related emails from" 
        />
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