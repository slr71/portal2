import 'date-fns'
import { useMutation } from "react-query"
import { useState } from 'react'
import { Container, Box, Paper, Tabs, Tab, Grid, Link, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, makeStyles } from '@material-ui/core'
import { Person as PersonIcon, Delete as DeleteIcon } from '@material-ui/icons'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { Layout, TabPanel, UpdateForm } from '../../../components'
import { useAPI } from '../../../contexts/api'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em'
  },
}))

const WorkshopEditor = ({ workshop, participants }) => {
  const classes = useStyles()
  const api = useAPI()

  const [tab, setTab] = useState(0)

  const handleTabChange = (event, newTab) => {
    setTab(newTab)
  }

  return (
    <Layout title={workshop.title} breadcrumbs>
      <Container maxWidth='lg'>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Settings" />
          <Tab label="Participants" />
          <Tab label="Requests" />
        </Tabs>
        <br />
        <TabPanel value={tab} index={0}>
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
        <TabPanel value={tab} index={1}>
          <Participants participants={participants} />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          Item Three
        </TabPanel>
      </Container>
    </Layout>
  )
}

const GeneralSettings = (props) => {
  const classes = useStyles()
  const api = useAPI()

  const [submitFormMutation] = useMutation(
    (data) => api.updateWorkshop(workshop.id, data),
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
        {organizers.map(organizer => (
          <Grid container justify="space-between" alignItems="center">
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
        {contacts.map(contact => (
          <Grid container justify="space-between" alignItems="center">
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
        {services.map(service => (
          <Grid container justify="space-between" alignItems="center">
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
          <Button variant="contained" color="primary" style={{marginRight:'1em', width:'8em'}}>Approve</Button>
          <Button variant="contained" color="primary" style={{width:'8em'}}>Add</Button>
        </Grid>
      </Grid>
      {/* <Typography color="textSecondary" gutterBottom>
      </Typography> */}
      <br />
      <TableContainer component={Paper}>
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
    </Paper>
  )
}

export async function getServerSideProps({ req, query }) {
  const workshop = await req.api.workshop(query.id)
  const participants = await req.api.workshopParticipants(query.id)

  return { 
    props: { 
      workshop, 
      participants 
    } 
  }
}

export default WorkshopEditor