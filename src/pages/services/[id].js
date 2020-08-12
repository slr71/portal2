import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Link, Box, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core'
import { Person as PersonIcon, List as ListIcon, MenuBook as MenuBookIcon } from '@material-ui/icons'
import { Layout, ServiceActionButton } from '../../components'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  },
}))

const Service = props => {
  const service = props.service
  const classes = useStyles()

  const question = service.questions && service.questions.length > 0 ? service.questions[0] : null // only Atmosphere has a question, and it has only one

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [answer, setAnswer] = React.useState()

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleSubmit = async () => {
    setDialogOpen(false)
    const response = await props.api.createServiceRequest(service.id, [{ questionId: question.id, value: answer }])
    //console.log(response)
  }

  const handleChangeAnswer = (e) => {
    setAnswer(e.target.value)
  }

  return ( //FIXME break into pieces
    <Layout {...props}>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper}>
          <Grid container spacing={4}>
            <Grid container item xs={12} justify="space-between">
              <Grid item>
                <Box display='flex'>
                  <Avatar alt={service.name} src={service.icon_url} />
                  <Typography component="h1" variant="h4" gutterBottom>{service.name}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <ServiceActionButton {...props} requestAccessHandler={handleOpenDialog}/>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography color="textSecondary">{service.description}</Typography>
                  <Link href={service.service_url}>{service.service_url}</Link>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="h5">Details</Typography>
                <Typography color="textSecondary"><Markdown>{service.about}</Markdown></Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="h5">Contacts</Typography>
                <Typography color="textSecondary">Contact(s) for questions or problems.</Typography>
                <List>
                  {service.contacts.map(contact => (
                    <Link key={contact.id} underline='none' href={`mailto:${contact.email}`}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={contact.name} />
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="h5">Resources</Typography>
                <Typography color="textSecondary">Where you can find support.</Typography>
                <List>
                  {service.resources.map(resource => (
                    <Link key={resource.id} underline='none' href={resource.url}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <MenuBookIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={resource.name} />
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="h5">Requests</Typography>
                <Typography color="textSecondary">Requests you can submit related to this service.</Typography>
                <List>
                  {service.forms.map(form => (
                    <Link key={form.id} underline='none' href={`/requests/${form.id}`}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <ListIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={form.name} />
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <RequestAccessDialog 
        question={question ? question.question : `Would you like to request access to ${service.name}?`}
        open={dialogOpen}
        handleChange={handleChangeAnswer}
        handleClose={handleCloseDialog} 
        handleSubmit={handleSubmit}
      />
    </Layout>
  )
}

const RequestAccessDialog = ({ question, open, handleChange, handleClose, handleSubmit }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Request Access</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {question}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          fullWidth
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export async function getServerSideProps({ req, query }) {
  //FIXME move user request into Express middleware
  const user = await req.api.user()
  const service = await req.api.service(query.id)

  return { props: { api: req.api, user, service } }
}

export default Service
