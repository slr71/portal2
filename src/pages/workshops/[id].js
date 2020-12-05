import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { makeStyles, Container, Paper, Grid, Box, Tabs, Tab, Typography, Tooltip, Button, IconButton, CircularProgress, Link, TextField, MenuItem, List, ListItem, ListItemText, ListItemAvatar, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Collapse } from '@material-ui/core'
import { Person as PersonIcon, Delete as DeleteIcon, KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { Layout, DateRange, DateSpan, TabPanel, UpdateForm, FormDialog, ContactsEditor } from '../../components'
import { useAPI } from '../../contexts/api'
import { useError } from '../../contexts/error'
import { useUser } from '../../contexts/user'
import { wsBaseUrl } from '../../config'
const { WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE } = require('../../constants')

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em'
  },
  cell: {
    border: 'none',
    verticalAlign: 'top'
  }
}))

const Workshop = (props) => {
  const workshop = props.workshop
  const [user] = useUser()
  const isEditor = user.is_staff || user.id == workshop.creator_id || workshop.organizers.some(o => o.id == user.id)

  return (
    <Layout title={workshop.title} breadcrumbs>
      <Container maxWidth='lg'>
        {isEditor 
          ? <WorkshopEditor {...props} />
          : <div><br /><WorkshopViewer {...props} /></div>
        }
      </Container>
    </Layout>
  )
}

const WorkshopViewer = (props) => {
  const workshop = props.workshop
  const classes = useStyles()
  const api = useAPI()
  const [user] = useUser()
  const [_, setError] = useError()

  const userWorkshop = user.workshops.find(w => w.id == workshop.id)
  const request = userWorkshop && userWorkshop.api_workshopenrollmentrequest
  const isHost = user.id == workshop.creator_id

  const [dialogOpen, setDialogOpen] = useState(false)
  const [requestStatus, setRequestStatus] = useState(request && request.status)

  const handleSubmit = async () => {
    setDialogOpen(false)
    setRequestStatus('submitted')
    try {
      const newRequest = await api.createWorkshopRequest(workshop.id)
      setRequestStatus(newRequest.status)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  // Configure web socket connection
  // The enrollment status will live udpate in cases where an instructor manually approves a request
  // while the user is viewing this page.
  useEffect(() => {
    const socket = new WebSocket(`${wsBaseUrl}/${user.username}`)

    // Listen for messages // TODO move into library
    socket.addEventListener('message', function (event) {
      console.log('Socket received:', event.data)
      if (!event || !event.data)
        return

      event = JSON.parse(event.data)
      if (event.type == WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE && event.data.workshopId == workshop.id) {
        setRequestStatus(event.data.status)
      }
    });
  }, [])

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <Grid container spacing={4}>
          <Grid container item xs={12} justify="space-between">
            <Grid item>
              <Box display="flex">
                <Typography component="h1" variant="h4" gutterBottom>{workshop.title}</Typography>
              </Box>
            </Grid>
            <Grid item>
              <WorkshopActionButton 
                status={requestStatus} 
                enrollmentBegins={workshop.enrollment_begins}
                enrollmentEnds={workshop.enrollment_ends}
                requestHandler={() => setDialogOpen(true)} 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography color="textSecondary">{workshop.description}</Typography>
              <br />
              <Typography color="textSecondary">
                Enrollment: <DateRange date1={workshop.enrollment_begins} date2={workshop.enrollment_ends} hideTime />
              </Typography>
              <Typography color="textSecondary">
                Workshop: <DateRange date1={workshop.start_date} date2={workshop.end_date} />
              </Typography>
              {isHost &&
                <Typography>
                  <b>Your are the workshop host</b>
                </Typography>
              }
            </Grid>
          </Grid>
          {workshop.about &&
            <Grid item xs={12}>
              <Typography component="div" variant="h5">Details</Typography>
              <Typography color="textSecondary"><Markdown>{workshop.about}</Markdown></Typography>
            </Grid>
          }
          {workshop.services && workshop.services.length > 0 &&
            <Grid item xs={12}>
              <Typography component="div" variant="h5">Services</Typography>
              <Typography color="textSecondary">Services used in the workshop.</Typography>
              <List>
                {workshop.services.map((service, index) => (
                  <Link key={index} underline='none' href={`/services/${service.id}`}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar alt={service.name} src={service.iconUrl} />
                      </ListItemAvatar>
                      <ListItemText primary={service.name} secondary={service.description}/>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Grid>
          }
        </Grid>
      </Paper>
      <RequestEnrollmentDialog 
        open={dialogOpen}
        workshop={workshop}
        handleClose={() => setDialogOpen(false)}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

const WorkshopActionButton = ({ status, enrollmentBegins, enrollmentEnds, requestHandler }) => {
  const { label, tooltip, action, disabled } = (() => {
    const now = Date.now()
    if (now > new Date(enrollmentEnds))
      return { label: 'ENROLLMENT PERIOD HAS ENDED', disabled: true }
    if (now < new Date(enrollmentBegins))
      return { label: 'ENROLLMENT PERIOD HAS NOT BEGUN', disabled: true }

    if (status === 'submitted')
      return { label: '...', disabled: true }
    if (status === 'granted')
      return { label: 'ENROLLED', disabled: true }
    if (status === 'pending' || status == 'approved')
      return {
        label: 'ENROLLMENT PENDING APPROVAL', 
        tooltip: 'The enrollment request is in process or awaiting approval.  You will be notified via email when completed.', 
        disabled: true
      }
    if (status === 'denied')
      return { 
        label: 'REQUEST DENIED', 
        tooltip: 'The access request was denied and an email was sent with an explanation.', 
        disabled: true
      }
    
    return { label: 'ENROLL', action: requestHandler }
  })()

  return (
    <Tooltip title={tooltip || ''}>
      <span>
        <Button 
          variant="contained" 
          color="primary" 
          size="medium" 
          style={{minWidth: "10em"}}
          disabled={disabled} 
          onClick={action}
        >
          {label}
        </Button> 
      </span>
    </Tooltip>
  )
}

const RequestEnrollmentDialog = ({ open, workshop, handleClose, handleSubmit }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
      <DialogContent>
        <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.6)' }}>
          <p>
            Click <strong>Enroll</strong> to submit a request to enroll in the workshop.
            Upon enrollment, you will automatically be granted access to all services used in the workshop.
          </p>
          <p>
            <strong>If you have been pre-approved to enroll</strong> this will happen
            immediately and you will recieve an enrollment confirmation email.
          </p>
          <p>
            <strong>If you have not been pre-approved</strong> the instructor will be emailed for manual approval.
          </p>
          <p>
            Would you like to enroll in the <strong>{workshop.title}</strong> workshop?
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleSubmit}>
          Enroll
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const WorkshopEditor = (props) => {
  const router = useRouter()
  const api = useAPI()
  const [_, setError] = useError()
  const [workshop, setWorkshop] = useState(props.workshop)
  const [participants, setParticipants] = useState()
  const [emails, setEmails] = useState()
  const [requests, setRequests] = useState()
  const [services, setServices] = useState()
  const [tab, setTab] = useState(router.query.t || 'view')

  useEffect(() => { 
      const fetchData = async () => {
        const [participants, emails, requests, services] = await Promise.all([
          api.workshopParticipants(workshop.id),
          api.workshopEmails(workshop.id),
          api.workshopRequests(workshop.id),
          api.services() // for adding a service 
        ])
        setParticipants(participants)
        setEmails(emails)
        setRequests(requests)
        setServices(services)
      }
      fetchData()
    }, 
    []
  )

  /*
   * All state management is done here since child components are remounted in tab change
   */

  const submitWorkshop = async (data) => {
    try {
      const newWorkshop = await api.updateWorkshop(workshop.id, data)
      setWorkshop(newWorkshop)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitOrganizer = async (userId) => {
    try {
      await api.createWorkshopOrganizer(workshop.id, userId)
      const newWorkshop = await api.workshop(workshop.id)
      setWorkshop(newWorkshop)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteOrganizer = async (userId) => {
    try {
      await api.deleteWorkshopOrganizer(workshop.id, userId)
      const newWorkshop = await api.workshop(workshop.id)
      setWorkshop(newWorkshop)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitContact = async (data) => {
    try {
      await api.createWorkshopContact(workshop.id, data)
      const newWorkshop = await api.workshop(workshop.id)
      setWorkshop(newWorkshop)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteContact = async (email) => {
    try {
      await api.deleteWorkshopContact(workshop.id, email)
      const newWorkshop = await api.workshop(workshop.id)
      setWorkshop(newWorkshop)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitService = async (serviceId) => {
    try {
      await api.createWorkshopService(workshop.id, serviceId)
      const newWorkshop = await api.workshop(workshop.id)
      setWorkshop(newWorkshop)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteService = async (serviceId) => {
    try {
      await api.deleteWorkshopService(workshop.id, serviceId)
      const newWorkshop = await api.workshop(workshop.id)
      setWorkshop(newWorkshop)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitParticipant = async (userId) => {
    try {
      await api.createWorkshopParticipant(workshop.id, userId)
      const newParticipants = await api.workshopParticipants(workshop.id)
      setParticipants(newParticipants)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteParticipant = async (participantId) => {
    try {
      await api.deleteWorkshopParticipant(workshop.id, participantId)
      const newParticipants = await api.workshopParticipants(workshop.id)
      setParticipants(newParticipants)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const submitEmail = async (data) => {
    try {
      await api.createWorkshopEmail(workshop.id, data)
      const newEmails = await api.workshopEmails(workshop.id)
      setEmails(newEmails)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const deleteEmail = async (email) => {
    try {
      await api.deleteWorkshopEmail(workshop.id, email)
      const newEmails = await api.workshopEmails(workshop.id)
      setEmails(newEmails)
    }
    catch(error) {
      console.log(error)
      setError(error.message)
    }
  }

  const updateRequest = async (status, message) => {
    try {
      await api.updateWorkshopRequest(workshop.id, { status, message })
      const newRequests = await api.workshopRequests(workshop.id)
      setRequests(newRequests)
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
        <Tab label="View" value="view" />
        <Tab label="Modify" value="modify" />
        <Tab label="Participants" value="participants" />
        <Tab label="Pre-approvals" value="preapprovals" />
        <Tab label="Requests" value="requests" />
      </Tabs>
      <br />
      <TabPanel value={tab} index="view">
        <WorkshopViewer workshop={workshop} />
      </TabPanel>
      <TabPanel value={tab} index="modify">
        <GeneralSettings {...workshop} submitHandler={submitWorkshop} />
        <br /><br />
        <EnrollmentPeriod {...workshop} submitHandler={submitWorkshop} />
        <br /><br />
        <Host {...workshop} submitHandler={submitWorkshop} />
        <br /><br />
        <Organizers {...workshop} submitHandler={submitOrganizer} deleteHandler={deleteOrganizer} />
        <br /><br />
        <ContactsEditor {...workshop} submitHandler={submitContact} deleteHandler={deleteContact} />
        <br /><br />
        <Services workshop={workshop} services={services} submitHandler={submitService} deleteHandler={deleteService} />
        <br /><br />
      </TabPanel>
      <TabPanel value={tab} index="participants">
        <Participants participants={participants} submitHandler={submitParticipant} deleteHandler={deleteParticipant} />
      </TabPanel>
      <TabPanel value={tab} index="preapprovals">
        <Emails emails={emails} submitHandler={submitEmail} deleteHandler={deleteEmail} />
      </TabPanel>
      <TabPanel value={tab} index="requests">
        <Requests requests={requests} submitHandler={updateRequest} />
      </TabPanel>
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
          { id: "title",
            name: "Title",
            type: "text",
            required: true,
            value: props.title,
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

const EnrollmentPeriod = ({ enrollment_begins, enrollment_ends, submitHandler }) => {
  const classes = useStyles()
  const [user] = useUser()
  const [errors, setErrors] = useState({})
  const isEditor = user.is_staff

  //TODO
  // const validate = (values) => {
  //   if (newDate(values['enrollment_begins']) > new Date(values['enrollment_ends'])
  //     setErrors({enrollment_begins})
  // }

  const handleChange = (values) => {
    console.log('Submit:', values)
    submitHandler(values)
  }

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography component="div" variant="h5">Enrollment Period</Typography> 
      <Typography color="textSecondary">
        Set the date range for when users will be able to enroll in the workshop and gain access to the relevant services.
        NOTE: these fields can only be changed by CyVerse staff.
      </Typography>
      <br />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            disabled={!isEditor}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            style={{width: '45%'}}
            id="enrollment_begins"
            label="Enrollment Begins"
            helperText="When should enrollment begin? This is the earliest users with an authorized email will be able to enroll and get access to the workshop services."
            value={enrollment_begins}
            onChange={(value) => handleChange({'enrollment_begins': value})}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardDatePicker
            disabled={!isEditor}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            style={{width: '45%'}}
            id="enrollment_ends"
            label="Enrollment Ends"
            helperText="When should enrollment end? After this date users will not be able to enroll in the workshop, even if their email is authorized."
            value={enrollment_ends}
            onChange={(value) => handleChange({'enrollment_ends': value})}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </Paper>
  )
}

const Host = ({ owner, submitHandler }) => {
  const classes = useStyles()
  const [user] = useUser()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <Typography component="div" variant="h5">Host</Typography> 
        <Typography color="textSecondary">
          The primary point of contact for this workshop. 
          This person will be allowed to authorize users for the workshop, approve enrollment requests, and edit workshop details.
          NOTE: this field can only be changed by CyVerse staff.
        </Typography>
        <br />
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Link href={`/administrative/users/${owner.id}`}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={owner.first_name + ' ' + owner.last_name} secondary={owner.username} />
              </ListItem>
            </Link>
          </Grid>
          {user.is_staff &&
            <Grid item>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setDialogOpen(true)}
              >
                Change Host
              </Button>
            </Grid>
          }
        </Grid>
      </Paper>
      <SearchUsersDialog 
        title='Set Host'
        description='Enter the user to set as the host for the workshop.'
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)} 
        handleSubmit={(user) => {
          setDialogOpen(false)
          submitHandler({ creator_id: user.id })
        }}
      />
    </div>
  )
}

const Organizers = ({ organizers, owner, submitHandler, deleteHandler }) => {
  const classes = useStyles()
  const [user] = useUser()
  const [dialogOpen, setDialogOpen] = useState(false)
  const isEditable = owner.id == user.id || user.is_staff

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <Typography component="div" variant="h5">Instructors/Organizers</Typography> 
        <Typography color="textSecondary">
          Add additional instructors/organizers for the workshop. 
          These people will be allowed to authorize users for the workshop, approve enrollment requests, and edit workshop details.
          NOTE: only the workshop host can add or remove additional instructors/organizers.
        </Typography>
        <br />
        <List>
          {organizers.map((organizer, index) => (
            <Grid container key={index} justify="space-between" alignItems="center">
              <Grid item>
                <Link href={`/administrative/users/${organizer.id}`}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={organizer.first_name + ' ' + organizer.last_name} secondary={organizer.username} />
                  </ListItem>
                </Link>
              </Grid>
              {isEditable &&
                <Grid item>
                  <IconButton onClick={() => deleteHandler(organizer.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              }
            </Grid>
          ))}
        </List>
        {isEditable &&
          <Box display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setDialogOpen(true)}
            >
              Add Organizer
            </Button>
          </Box>
        }
      </Paper>
      <SearchUsersDialog 
        title='Add Organizer'
        description='Enter the user to add as an organizer for the workshop.'
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)} 
        handleSubmit={(user) => {
          setDialogOpen(false)
          submitHandler(user.id)
        }}
      />
    </div>
  )
}

const Services = ({ workshop, services, submitHandler, deleteHandler }) => {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <Typography component="div" variant="h5">Services</Typography> 
        <Typography color="textSecondary">Services users need access to for this workshop.</Typography>
        <br />
        <List>
          {workshop.services.map((service, index) => (
            <Grid container key={index} justify="space-between" alignItems="center">
              <Grid item>
                <Link href={service.service_url}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={service.icon_url} />
                    </ListItemAvatar>
                    <ListItemText primary={service.name} />
                  </ListItem>
                </Link>
              </Grid>
              <Grid item>
                <IconButton onClick={() => deleteHandler(service.id)}>
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
            Add Service
          </Button>
        </Box>
      </Paper>
      <AddServiceDialog 
        open={dialogOpen}
        services={workshop.services}
        allServices={services}
        handleClose={() => setDialogOpen(false)} 
        handleSubmit={(serviceId) => {
          setDialogOpen(false)
          submitHandler(serviceId)
        }}
      />
    </div>
  )
}

const Participants = ({ participants, submitHandler, deleteHandler }) => {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (  
    <div>      
      <Paper elevation={3} className={classes.paper}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography component="h1" variant="h4">Participants</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              The users below are enrolled in this workshop.
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              style={{width:'10em', whiteSpace: 'nowrap'}}
              onClick={() => setDialogOpen(true)}
            >
              Enroll User
            </Button>
          </Grid>
        </Grid>
        <br />
        {!participants || participants.length == 0 
          ? <Typography>None</Typography>
          : <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participants.map(({ id, username, first_name, last_name, email }, index) => (
                    <TableRow key={index}>
                      <TableCell>{first_name + ' ' + last_name}</TableCell>
                      <TableCell>{username}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => deleteHandler(id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        }
      </Paper>
      <SearchUsersDialog 
        title='Enroll User'
        description='Enter the user to enroll in the workshop.'
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleSubmit={(user) => {
          setDialogOpen(false)
          submitHandler(user.id)
        }}
      />
    </div>
  )
}

const Emails = ({ emails, submitHandler, deleteHandler }) => {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)

  return ( 
    <div>       
      <Paper elevation={3} className={classes.paper}>
        <Grid container justify="space-between">
          <Grid item style={{width:'70%'}}>
            <Typography component="h1" variant="h4">Pre-approvals</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              The users below (shown by CyVerse email address) are pre-approved to enroll in this workshop.
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              style={{width:'10em', whiteSpace: 'nowrap'}}
              onClick={() => setDialogOpen(true)}
            >
              Add Email
            </Button>
          </Grid>
        </Grid>
        <br />
        {!emails || emails.length == 0 
          ? <Typography>None</Typography>
          : <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emails.map(({ email }, index) => (
                    <TableRow key={index}>
                      <TableCell>{email}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => deleteHandler(email)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        }
      </Paper>
      <FormDialog 
        title="Add Email"
        open={dialogOpen}
        fields={[
          {
            id: "email",
            label: "Email",
            type: "email",
            required: true
          }
        ]}
        handleClose={() => setDialogOpen(false)} 
        handleSubmit={(values) => {
          setDialogOpen(false)
          submitHandler(values)
        }}
      />
    </div>
  )
}

const Requests = ({ requests, submitHandler }) => {
  const classes = useStyles()

  const Status = ({ value }) => {
    let color = 'black';

    switch (value) {
      case 'pending':
      case 'approved': color = 'inherit'; break;
      case 'granted': color = 'primary'; break;
      case 'denied': color = 'error'; break;
    }

    return <Typography color={color}>{value.toUpperCase()}</Typography>
  }

  const Row = ({ user, created_at, status, logs }) => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{user.first_name + ' ' + user.last_name}</TableCell>
          <TableCell>{user.username}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell style={{whiteSpace: 'nowrap'}}>
            <DateSpan date={created_at} />
          </TableCell>
          <TableCell>
            <Status value={status} />
          </TableCell>
          <TableCell style={{whiteSpace: 'nowrap'}} align="right">
            <Button 
              color="primary" 
              size="small" 
              disabled={status == 'denied' || status == 'granted'}
              onClick={() => submitHandler('denied', `Request denied by ${user.username}`)}
            >
              Deny
            </Button>
            <Button 
              color="primary" 
              size="small"
              disabled={status == 'approved' || status == 'granted'}
              onClick={() => submitHandler('approved', `Request approved by ${user.username}`)}
            >
              Approve
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box m={2}>
                <Grid container>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography><b>User Info</b></Typography>
                    <Table size="small" padding='none'>
                      <TableRow>
                        <TableCell className={classes.cell}>Company/Institution</TableCell>
                        <TableCell className={classes.cell}>{user.institution}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cell}>Department</TableCell>
                        <TableCell className={classes.cell}>{user.department}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cell}>Occupation</TableCell>
                        <TableCell className={classes.cell}>{user.occupation.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cell}>Country</TableCell>
                        <TableCell className={classes.cell}>{user.region.country.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cell}>Region</TableCell>
                        <TableCell className={classes.cell}>{user.region.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cell}>Research Area</TableCell>
                        <TableCell className={classes.cell}>{user.research_area.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cell}>Funding Agency</TableCell>
                        <TableCell className={classes.cell}>{user.funding_agency.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <Link href={`/administrative/users/${user.id}`}>View Details</Link>
                      </TableRow>
                    </Table>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography><b>History</b></Typography>
                    <Table size="small" padding='none'>
                    {logs.map(({status, message, created_at}, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.cell}>
                          <Typography variant='subtitle2' color='textSecondary' noWrap>
                            <DateSpan date={created_at} />
                          </Typography>
                        </TableCell>
                        <TableCell className={classes.cell}>{message}</TableCell>
                      </TableRow>
                    ))}
                    </Table>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  return (        
    <Paper elevation={3} className={classes.paper}>
      <Typography component="h1" variant="h4">Requests</Typography>
      <br />
      {!requests || requests.length == 0 
        ? <Typography>None</Typography>
        : <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request, index) => (
                  <Row key={index} {...request} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      }
    </Paper>
  )
}

const SearchUsersDialog = ({ open, title, description, handleClose, handleSubmit }) => {
  const api = useAPI()
  const [users, setUsers] = useState()
  const [debounce, setDebounce] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState()

  const handleChange = (event) => {
    const { value } = event.target

    // Couldn't get just-debounce-it to work here
    if (debounce) clearTimeout(debounce)
    if (!value)
      reset()
    else
      setDebounce(setTimeout(async () => {
        setLoading(true)
        const resp = await api.users({ keyword: value })
        setUsers(resp.results)
        setLoading(false)
      }, 1000));
  }

  const handleSelect = (event, value) => {
    setSelectedUser(value)
  }

  const reset = () => {
    setUsers(null)
    setSelectedUser(null)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description}
        </DialogContentText>
        <Autocomplete
          freeSolo
          id="user"
          disableClearable
          options={users || []}
          getOptionLabel={(u) => `${u.first_name} ${u.last_name} (${u.username})`}
          onChange={handleSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search users"
              margin="normal"
              InputProps={{ 
                ...params.InputProps, 
                endAdornment: (
                  <React.Fragment>
                    {loading 
                      ? <CircularProgress color="inherit" size={20} /> 
                      : (users && users.length == 0 ? 'No results' : null)
                    }
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
              onChange={handleChange}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          variant="outlined"
          onClick={() => reset() || handleClose()}
          onBlur={() => reset() || handleClose()}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          disabled={!selectedUser || !handleSubmit}
          onClick={() => handleSubmit(selectedUser)}  
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const AddServiceDialog = ({ open, services, allServices, handleClose, handleSubmit }) => {
  const availableServices = allServices && allServices.filter(s => s.approval_key != '' && !services.some(s2 => s2.id == s.id))
  const [selected, setSelected] = useState()

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add Service</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="normal"
          fullWidth
          label="Select a service"
          value={selected || ''}
        >
          {availableServices && availableServices.map((service, index) => (
            <MenuItem key={index} value={service.id} onClick={(e) => setSelected(service.id)}>
              {service.name}
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
  const workshop = await req.api.workshop(query.id)
  return { props: { workshop } }
}

export default Workshop