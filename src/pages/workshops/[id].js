import { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Grid, Box, Typography, Tooltip, Button, Link, List, ListItem, ListItemText, ListItemAvatar, Avatar, Dialog, DialogContent, DialogActions } from '@material-ui/core'
import { Layout, DateRange } from '../../components'
import { useAPI } from '../../contexts/api'
import { useUser } from '../../contexts/user'
import { wsBaseUrl } from '../../config'
const { WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE } = require('../../constants')

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Workshop = props => {
  const workshop = props.workshop
  const classes = useStyles()
  const api = useAPI()
  const user = useUser()
  const userWorkshop = user.workshops.find(w => w.id == workshop.id)
  const request = userWorkshop && userWorkshop.api_workshopenrollmentrequest

  const [dialogOpen, setDialogOpen] = useState(false)
  const [requestStatus, setRequestStatus] = useState(request && request.status)

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleSubmit = async () => {
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

  return ( //FIXME break into pieces
    <Layout title={workshop.title} breadcrumbs>
      <Container maxWidth='md'>
        <br />
        <Paper elevation={3} className={classes.paper}>
          <Grid container spacing={4}>
            <Grid container item xs={12} justify="space-between">
              <Grid item>
                <Box display="flex">
                  <Typography component="h1" variant="h4" gutterBottom>{workshop.title}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <WorkshopActionButton status={requestStatus} requestHandler={handleOpenDialog} />
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
      </Container>
      <RequestEnrollmentDialog 
        open={dialogOpen}
        workshop={workshop}
        handleClose={handleCloseDialog}
        handleSubmit={handleSubmit}
      />
    </Layout>
  )
}

const WorkshopActionButton = ({ status, requestHandler }) => {
  // Request status can be: 'granted', 'denied', 'pending', 'requested'

  const { label, tooltip, action, disabled } = (() => {
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

export async function getServerSideProps({ req, query }) {
  const workshop = await req.api.workshop(query.id)

  return { props: { workshop } }
}

export default Workshop