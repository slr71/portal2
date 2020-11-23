import { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { makeStyles, Container, Grid, Link, Box, Button, IconButton, Paper, Tabs, Tab, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, MenuItem } from '@material-ui/core'
import { Person as PersonIcon, List as ListIcon, MenuBook as MenuBookIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { Layout, ServiceActionButton, TabPanel, UpdateForm, QuestionsEditor, ContactsEditor, ResourcesEditor } from '../../components'
import { useAPI } from '../../contexts/api'
import { useError } from '../../contexts/error'
import { useUser } from '../../contexts/user'
import { wsBaseUrl } from '../../config'
const { WS_SERVICE_ACCESS_REQUEST_STATUS_UPDATE } = require('../../constants')

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em'
  },
}))

const Service = (props) => {
  const service = props.service
  const user = useUser()

  return ( 
    <Layout title={service.name} breadcrumbs>
      <Container maxWidth='lg'>
        {user.is_staff 
          ? <ServiceEditor {...props} />
          : <div><br /><ServiceViewer {...props} /></div>
        }
        <br />
      </Container>
    </Layout>
  )
}

const ServiceViewer = (props) => {
  const service = props.service
  const classes = useStyles()
  const api = useAPI()
  const user = useUser()
  const [_, setError] = useError()
  const userService = user.services.find(s => s.id == service.id)
  const request = userService && userService.request

  // only Atmosphere has a question, and it has only one
  const question = service.questions && service.questions.length > 0 ? service.questions[0] : null 

  const [requestStatus, setRequestStatus] = useState(request && request.status)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [answer, setAnswer] = useState()

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const submitAccessRequest = async () => {
    try {
      await api.createServiceRequest(service.id, [{ questionId: question && question.id, value: answer }])
      handleCloseDialog()
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  // Configure web socket connection
  useEffect(() => {
    const socket = new WebSocket(`${wsBaseUrl}/${user.username}`)

    // Listen for messages // TODO move into library
    socket.addEventListener('message', function (event) {
      console.log('Socket received:', event.data)
      if (!event || !event.data)
        return

      event = JSON.parse(event.data)
      if (event.data.type == WS_SERVICE_ACCESS_REQUEST_STATUS_UPDATE && event.data.serviceId == service.id) {
        setRequestStatus(event.data.status)
      }
    });
  }, [])

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <Grid container spacing={4}>
          <Grid container item xs={12}  justify="space-between">
            <Grid item>
              <Box display='flex' flexWrap="wrap" alignSelf="flex-end" >
              <Box mr={2}>
                <Avatar alt={service.name} src={service.icon_url} />
                </Box>
                <Typography component="h1" variant="h4" gutterBottom>{service.name}</Typography>
              </Box>
            </Grid>
            <Grid item>
              <ServiceActionButton service={service} status={requestStatus} requestAccessHandler={handleOpenDialog} />
            </Grid>
            <Grid item xs={12}>
              <Box my={1}>
                <Typography color="textPrimary">{service.description}</Typography>
                <Link href={service.service_url}>{service.service_url}</Link>
              </Box>
            </Grid>
          </Grid>
          {service.about &&
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="h5">Details</Typography>
                <Typography color="textPrimary"><Markdown>{service.about}</Markdown></Typography>
              </Box>
            </Grid>
          }
          {service.contacts && service.contacts.length > 0 &&
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="h5">Contacts</Typography>
                <Typography color="textSecondary">Contact(s) for questions or problems.</Typography>
                <List>
                  {service.contacts.map(contact => (
                    <div key={contact.id}>
                      <Button color="primary" href={`mailto:${contact.email}`}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={contact.name} />
                        </ListItem>
                      </Button>
                    </div>
                  ))}
                </List>
              </Box>
            </Grid>
          }
          {service.resources && service.resources.length > 0 &&
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="h5">Resources</Typography>
                <Typography color="textSecondary">Where you can find support.</Typography>
                <List>
                  {service.resources.map(resource => (
                    <div key={resource.id}>
                      <Link underline='none' href={resource.url}>
                        <Button color="primary">
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <MenuBookIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={resource.name} />
                          </ListItem>
                        </Button>
                      </Link>
                    </div>
                  ))}
                </List>
              </Box>
            </Grid>
          }
          {service.forms && service.forms.length > 0 &&
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="h5">Requests</Typography>
                <Typography color="textSecondary">Requests you can submit related to this service.</Typography>
                <List>
                  {service.forms.map(form => (
                    <div key={form.id}>
                      <Link underline='none' href={`/requests/${form.id}`}>
                        <Button color="primary"><ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <ListIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={form.name} />
                          </ListItem>
                        </Button>
                      </Link>
                    </div>
                  ))}
                </List>
              </Box>
            </Grid>
          }
        </Grid>
      </Paper>
      <RequestAccessDialog 
        question={question ? question.question : `Would you like to request access to ${service.name}?`}
        requiresAnswer={!!question}
        open={dialogOpen}
        handleChange={(e) => setAnswer(e.target.value)}
        handleClose={handleCloseDialog} 
        handleSubmit={
          (!question || answer) && // disable submit button if input is blank and answer is required
            (() => {
              setRequestStatus('requested')
              handleCloseDialog()
              submitAccessRequest()
            })
        }
      />
    </div>
  )
}

const RequestAccessDialog = ({ question, requiresAnswer, open, handleChange, handleClose, handleSubmit }) => (
  <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
    <DialogContent>
      <DialogContentText>
        <p>{question}</p>
      </DialogContentText>
      {requiresAnswer &&
        <TextField
          autoFocus
          margin="dense"
          id="name"
          fullWidth
          onChange={handleChange}
        />
      }
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={handleClose}>
        Cancel
      </Button>
      <Button color="primary" variant="contained" disabled={!handleSubmit} onClick={handleSubmit}>
        Request Access
      </Button>
    </DialogActions>
  </Dialog>
)

const ServiceEditor = (props) => {
  const api = useAPI()
  const [service, setService] = useState(props.service)
  const [forms, setForms] = useState()
  const [tab, setTab] = useState(0)

  useEffect(() => { 
      const fetchData = async () => {
        const formsByGroup = await api.forms()
        const forms = formsByGroup
          .map(s => s.forms)
          .reduce((acc, forms) => acc.concat(forms))
          .sort((a, b) => (a.name > b.name) ? 1 : -1)
        setForms(forms)
      }
      fetchData()
    }, 
    []
  )

  const submitService = async (data) => {
    try {
      const newService = await api.updateService(service.id, data)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitQuestion = async (data) => {
    try {
      await api.createServiceQuestion(service.id, data)
      const newService = await api.service(service.id)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteQuestion = async (questionId) => {
    try {
      await api.deleteServiceQuestion(service.id, questionId)
      const newService = await api.service(service.id)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitContact = async (data) => {
    try {
      await api.createServiceContact(service.id, data)
      const newService = await api.service(service.id)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteContact = async (contactId) => {
    try {
      await api.deleteServiceContact(service.id, contactId)
      const newService = await api.service(service.id)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitResource = async (data) => {
    try {
      await api.createServiceResource(service.id, data)
      const newService = await api.service(service.id)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteResource = async (resourceId) => {
    try {
      await api.deleteServiceResource(service.id, resourceId)
      const newService = await api.service(service.id)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitRequest = async (formId) => {
    try {
      await api.createServiceForm(service.id, formId)
      const newService = await api.service(service.id)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteRequest = async (formId) => {
    try {
      await api.deleteServiceForm(service.id, formId)
      const newService = await api.service(service.id)
      setService(newService)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  return (
    <div>
      <Tabs
        value={tab}
        onChange={(_, newTab) => setTab(newTab)}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="View" />
        <Tab label="Modify" />
      </Tabs>
      <br />
      <TabPanel value={tab} index={0}>
        <ServiceViewer {...props} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <GeneralSettings {...service} submitHandler={submitService} />
        <br /><br />
        <QuestionsEditor {...service} submitHandler={submitQuestion} deleteHandler={deleteQuestion} />
        <br /><br />
        <ContactsEditor {...service} submitHandler={submitContact} deleteHandler={deleteContact} />
        <br /><br />
        <ResourcesEditor {...service} submitHandler={submitResource} deleteHandler={deleteResource} />
        <br /><br />
        <RequestsEditor {...service} allForms={forms} submitHandler={submitRequest} deleteHandler={deleteRequest} />
        <br /><br />
      </TabPanel>
      {/* <TabPanel value={tab} index={2}>
        <Participants participants={props.participants} />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <Requests requests={props.requests} />
      </TabPanel> */}
    </div>
  )
}

const GeneralSettings = (props) => {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paper}>
      <UpdateForm 
        title="General"
        fields={[
          { id: "name",
            name: "Name",
            type: "text",
            required: true,
            value: props.name,
          },
          { id: "description",
            name: "Description",
            type: "text",
            required: false,
            value: props.description
          },
          { id: "about",
            name: "Details",
            type: "text",
            required: false,
            value: props.about,
            multiline: true,
            rows: 4
          },
          { id: "service_url",
            name: "Service URL",
            type: "text",
            required: true,
            value: props.service_url,
          },
          { id: "icon_url",
            name: "Icon URL",
            type: "text",
            required: true,
            value: props.icon_url,
          }
        ]} 
        initialValues={{...props}} // unused fields will be ignored
        autosave
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            console.log('Submit:', values)
            props.submitHandler(values)
            setSubmitting(false)
          }, 1000)
        }}
      />
    </Paper>
  )
}

const RequestsEditor = ({ forms, allForms, submitHandler, deleteHandler }) => {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div>
    <Paper elevation={3} className={classes.paper}>
      <Typography component="div" variant="h5">Requests</Typography> 
      <Typography color="textSecondary">Requests you can submit related to this service.</Typography>
      <br />
      <List>
        {forms.map((form, index) => (
          <Grid container key={index} justify="space-between" alignItems="center">
            <Grid item>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <ListIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={form.name} />
              </ListItem>
            </Grid>
            <Grid item>
              <IconButton onClick={() => deleteHandler(form.id)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </List>
      <Box display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Add Request
        </Button>
      </Box>
    </Paper>
    <AddRequestDialog 
      open={dialogOpen}
      forms={forms}
      allForms={allForms}
      handleClose={() => setDialogOpen(false)} 
      handleSubmit={(formId) => {
        setDialogOpen(false)
        submitHandler(formId)
      }}
    />
  </div>
  )
}

const AddRequestDialog = ({ open, forms, allForms, handleClose, handleSubmit }) => {
  const availableForms = allForms.filter(f => !forms.some(f2 => f2.id == f.id))
  const [selected, setSelected] = useState()

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add Request</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="normal"
          fullWidth
          label="Select a request"
          value={selected || ''}
        >
          {availableForms && availableForms.map((form, index) => (
            <MenuItem key={index} value={form.id} onClick={(e) => setSelected(form.id)}>
              {form.name}
            </MenuItem>
          ))}
        </TextField>
        <br />
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelected(null) || handleClose()} variant="outlined">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          disabled={!selected || !handleSubmit}
          onClick={() => setSelected(null) || handleSubmit(selected)}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export async function getServerSideProps({ req, query }) {
  const service = await req.api.service(query.id)
  return { props: { service } }
}

export default Service
