import { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Link, Box, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Dialog, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core'
import { Person as PersonIcon, List as ListIcon, MenuBook as MenuBookIcon } from '@material-ui/icons'
import { Layout, ServiceActionButton } from '../../components'
import { useMutation } from "react-query"
import { useAPI } from '../../contexts/api'
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
  const classes = useStyles()
  const api = useAPI()
  const user = useUser()
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

  const [submitRequestMutation] = useMutation(
    () => api.createServiceRequest(service.id, [{ questionId: question && question.id, value: answer }]),
    {
      onSuccess: (resp) => {
        console.log(resp)
        setDialogOpen(false)
      },
      onError: (error) => {
        console.log('ERROR', error)
      }
    }
  )

  const handleChangeAnswer = (e) => {
    setAnswer(e.target.value)
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

  return ( //FIXME break into pieces
    <Layout title={service.name} breadcrumbs>
      <Container maxWidth='lg'>
        <br />
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
            {service.contacts.length > 0 &&
              <Grid item xs={12}>
                <Box>
                  <Typography component="div" variant="h5">Contacts</Typography>
                  <Typography color="textSecondary">Contact(s) for questions or problems.</Typography>
                  <List>
                    {service.contacts.map(contact => (
                      <Button key={contact.id} color="primary" href={`mailto:${contact.email}`}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={contact.name} />
                        </ListItem>
                      </Button>
                    ))}
                  </List>
                </Box>
              </Grid>
            }
            {service.resources.length > 0 &&
              <Grid item xs={12}>
                <Box>
                  <Typography component="div" variant="h5">Resources</Typography>
                  <Typography color="textSecondary">Where you can find support.</Typography>
                  <List>
                    {service.resources.map(resource => (
                      <Link key={resource.id} underline='none' href={resource.url}>
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
                    ))}
                  </List>
                </Box>
              </Grid>
            }
            {service.forms.length > 0 &&
              <Grid item xs={12}>
                <Box>
                  <Typography component="div" variant="h5">Requests</Typography>
                  <Typography color="textSecondary">Requests you can submit related to this service.</Typography>
                  <List>
                    {service.forms.map(form => (
                      <Link key={form.id} underline='none' href={`/requests/${form.id}`}>
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
                    ))}
                  </List>
                </Box>
              </Grid>
            }
          </Grid>
        </Paper>
      </Container>
      <RequestAccessDialog 
        question={question ? question.question : `Would you like to request access to ${service.name}?`}
        requiresAnswer={!!question}
        open={dialogOpen}
        handleChange={handleChangeAnswer}
        handleClose={handleCloseDialog} 
        handleSubmit={
          (!question || answer) && // disable submit button if input is blank and answer is required
            (() => {
              setRequestStatus('pending')
              handleCloseDialog()
              submitRequestMutation()
            })
        }
      />
    </Layout>
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

export async function getServerSideProps({ req, query }) {
  const service = await req.api.service(query.id)
  return { props: { service } }
}

export default Service
