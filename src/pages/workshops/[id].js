import 'date-fns'
import { useState, useEffect } from 'react'
import { useMutation } from "react-query"
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Grid, Box, Tabs, Tab, Typography, Tooltip, Button, IconButton, Link, List, ListItem, ListItemText, ListItemAvatar, Avatar, Dialog, DialogContent, DialogActions, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Collapse } from '@material-ui/core'
import { Person as PersonIcon, Delete as DeleteIcon, KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { Layout, DateRange, TabPanel, UpdateForm } from '../../components'
import { useAPI } from '../../contexts/api'
import { useUser } from '../../contexts/user'
import { wsBaseUrl } from '../../config'
const { WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE } = require('../../constants')

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  },
  noBorder: {
    border: 'none'
  }
}))

const Workshop = (props) => {
  const workshop = props.workshop
  const user = useUser()
  const isEditor = user.is_staff || workshop.creator_id == user.id

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
  const user = useUser()
  const userWorkshop = user.workshops.find(w => w.id == workshop.id)
  const request = userWorkshop && userWorkshop.api_workshopenrollmentrequest
  const isHost = user.id == workshop.creator_id

  const [dialogOpen, setDialogOpen] = useState(false)
  const [requestStatus, setRequestStatus] = useState(request && request.status)

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleSubmit = async () => {
    setRequestStatus('requested')
    handleCloseDialog()
    const response = await api.createWorkshopRequest(workshop.id)
    console.log(response)
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
      if (event.data.type == WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE && event.data.workshopId == workshop.id) {
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
                requestHandler={handleOpenDialog} 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography color="textSecondary">{workshop.description}</Typography>
              <br />
              <Typography color="textSecondary">
                Enrollment: <DateRange date1={workshop.enrollment_begins} date2={workshop.enrollment_ends} />
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
          {workshop.services.length > 0 &&
            <Grid item xs={12}>
              <Typography component="div" variant="h5">Services</Typography>
              <Typography color="textSecondary">Services used in the workshop.</Typography>
              <List>
                {workshop.services.map(service => (
                  <Link key={service.id} underline='none' href={`/services/${service.id}`}>
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
        handleClose={handleCloseDialog}
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

    // Request status can be: 'granted', 'denied', 'pending', 'requested'
    if (status === 'granted')
      return { label: 'ENROLLED', disabled: true }
    if (status === 'pending' || status == 'requested' || status == 'approved')
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
        <Button variant="contained" color="primary" size="medium" disabled={disabled} onClick={action}>
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
            Click <strong>Enroll</strong> to submit a request to be enrolled in the workshop.
            Upon enrollment, you will automatically be granted access to all services used in the workshop.
          </p>
          <p>
            <strong>If you are in the list of pre-approved participants</strong>, this will happen
            immediately, and you will recieve an email notifying you of your enrollment.
          </p>
          <p>
            <strong>If you have not been pre-approved</strong>, a request will be created, and
            the instructor will be emailed for manual approval.
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

const WorkshopEditor = ({ workshop, participants, requests }) => {
  const [tab, setTab] = useState(0)

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
        <Tab label="Participants" />
        <Tab label="Requests" />
      </Tabs>
      <br />
      <TabPanel value={tab} index={0}>
        <WorkshopViewer workshop={workshop} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <GeneralSettings {...workshop} />
        <br /><br />
        <EnrollmentPeriod {...workshop} />
        <br /><br />
        <Owner {...workshop} />
        <br /><br />
        <Organizers {...workshop} />
        <br /><br />
        <Contacts {...workshop} />
        <br /><br />
        <Services {...workshop} />
        <br /><br />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Participants participants={participants} />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <Requests requests={requests} />
      </TabPanel>
    </div>
  )
}

const GeneralSettings = (props) => {
  const classes = useStyles()
  const api = useAPI()

  const [submitFormMutation] = useMutation(
    (data) => api.updateWorkshop(workshop.id, data)
  )

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
            required: true,
            value: props.description
          },
          { id: "about",
            name: "About",
            type: "text",
            required: true,
            value: props.about,
            multiline: true,
            rows: 2
          }
        ]} 
        initialValues={{...props}} // unused fields will be ignored
        autosave
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            console.log('Submit:', values)
            submitFormMutation(values)
            setSubmitting(false)
          }, 1000)
        }}
      />
    </Paper>
  )
}

const EnrollmentPeriod = ({ enrollment_begins, enrollment_ends }) => {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography component="div" variant="h5">Enrollment Period</Typography> 
      <Typography color="textSecondary">
        Set the date range for when users will be able to enroll in the workshop and gain access to the relevant services.
        NOTE: These fields can only be changed by CyVerse staff.
      </Typography>
      <br />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            style={{width: '45%'}}
            id="enrollment_begins"
            label="Enrollment Begins"
            helperText="When should enrollment begin? This is the earliest users with an authorized email will be able to enroll and get access to the workshop services."
            value={enrollment_begins}
            // onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            style={{width: '45%'}}
            id="enrollment_ends"
            label="Enrollment Ends"
            helperText="When should enrollment end? After this date users will not be able to enroll in the workshop, even if their email is authorized."
            value={enrollment_ends}
            // onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </Paper>
  )
}

const Owner = ({ owner }) => {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography component="div" variant="h5">Owner</Typography> 
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
        <Grid item>
          <Button variant="contained" color="primary">Change Owner</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

const Organizers = ({ organizers }) => {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography component="div" variant="h5">Instructors/Organizers</Typography> 
      <Typography color="textSecondary">
        Add additional instructors/organizers for the workshop. 
        These people will be allowed to authorize users for the workshop, approve enrollment requests, and edit workshop details.
        NOTE: Only the workshop owner can add or remove additional instructors/organizers.
      </Typography>
      <br />
      <List>
        {organizers.map((organizer, index) => (
          <Grid container key={index} justify="space-between" alignItems="center">
            <Grid item>
              <Link key={organizer.id} href={`/administrative/users/${organizer.id}`}>
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
            <Grid item>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </List>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary">Add Organizer</Button>
      </Box>
    </Paper>
  )
}

const Contacts = ({ contacts }) => {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography component="div" variant="h5">Support Contacts</Typography> 
      <Typography color="textSecondary">Who participants should reach out to if they have questions.</Typography>
      <br />
      <List>
        {contacts.map((contact, index) => (
          <Grid container key={index} justify="space-between" alignItems="center">
            <Grid item>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={contact.name} secondary={contact.email} />
              </ListItem>
            </Grid>
            <Grid item>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </List>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary">Add Contact</Button>
      </Box>
    </Paper>
  )
}

const Services = ({ services }) => {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography component="div" variant="h5">Services</Typography> 
      <Typography color="textSecondary">Services users need access to for this workshop.</Typography>
      <br />
      <List>
        {services.map((service, index) => (
          <Grid container key={index} justify="space-between" alignItems="center">
            <Grid item>
              <Link key={service.id} href={service.service_url}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={service.icon_url} />
                  </ListItemAvatar>
                  <ListItemText primary={service.name} />
                </ListItem>
              </Link>
            </Grid>
            <Grid item>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </List>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary">Add Service</Button>
      </Box>
    </Paper>
  )
}

const Participants = ({ participants }) => {
  const classes = useStyles()

  return (        
    <Paper elevation={3} className={classes.paper}>
      <Grid container justify="space-between">
        <Grid item>
          <Typography component="h1" variant="h4">Participants</Typography>
        </Grid>
        <Grid item>
          <Tooltip title='Approve a user for the workshop which will allow them to enroll'>
            <Button variant="contained" color="primary" style={{marginRight:'1em', width:'8em'}}>Approve</Button>
          </Tooltip>
          <Tooltip title='Directly enroll a user in the workshop, granting access to all workshop services'>
            <Button variant="contained" color="primary" style={{width:'8em'}}>Enroll</Button>
          </Tooltip>
        </Grid>
      </Grid>
      {/* <Typography color="textSecondary" gutterBottom>
      </Typography> */}
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
                {participants.map(({ id, username, first_name, last_name, email }) => (
                  <TableRow key={id}>
                    <TableCell>{first_name + ' ' + last_name}</TableCell>
                    <TableCell>{username}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell align="right">
                      <IconButton>
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
  )
}

const Requests = ({ requests }) => {
  const classes = useStyles()

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
          <TableCell style={{whiteSpace: 'nowrap'}}>{created_at}</TableCell>
          <TableCell>{status}</TableCell>
          <TableCell style={{whiteSpace: 'nowrap'}} align="right">
            <Button color="primary" size="small">Deny</Button>
            <Button color="primary" size="small">Approve</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={3}>
                <Typography><b>User Info</b></Typography>
                <Table size="small">
                  <TableRow>
                    <TableCell className={classes.noBorder}>Company/Institution</TableCell>
                    <TableCell className={classes.noBorder}>{user.institution}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.noBorder}>Department</TableCell>
                    <TableCell className={classes.noBorder}>{user.department}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.noBorder}>Occupation</TableCell>
                    <TableCell className={classes.noBorder}>{user.occupation.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.noBorder}>Country</TableCell>
                    <TableCell className={classes.noBorder}>{user.region.country.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.noBorder}>Region</TableCell>
                    <TableCell className={classes.noBorder}>{user.region.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.noBorder}>Research Area</TableCell>
                    <TableCell className={classes.noBorder}>{user.research_area.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.noBorder}>Funding Agency</TableCell>
                    <TableCell className={classes.noBorder}>{user.funding_agency.name}</TableCell>
                  </TableRow>
                </Table>
              </Box>
              <Box margin={3}>
                <Typography><b>History</b></Typography>
                <Table size="small">
                {logs.map(({status, message, created_at}, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.noBorder}>
                      <Typography variant='subtitle2' color='textSecondary'>{created_at}</Typography>
                    </TableCell>
                    <TableCell className={classes.noBorder}>{message}</TableCell>
                  </TableRow>
                ))}
                </Table>
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

export async function getServerSideProps({ req, query }) {
  const workshop = await req.api.workshop(query.id)

  // These will fail if user is not staff
  const participants = await req.api.workshopParticipants(query.id)
  const requests = await req.api.workshopRequests(query.id)

  return { 
    props: { 
      workshop, 
      participants,
      requests
    } 
  }
}

export default Workshop