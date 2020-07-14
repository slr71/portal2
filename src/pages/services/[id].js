import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Link, Box, Divider, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core'
import { Person as PersonIcon, List as ListIcon, MenuBook as MenuBookIcon } from '@material-ui/icons'
import { Layout, ServiceActionButton } from '../../components'
import api from '../../api'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Service = props => {
  const service = props.service
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = async () => {
    const response = await api.createServiceRequest(service.id)
    //console.log(response)
  }

  return ( //FIXME break into pieces
    <Layout {...props}>
      <Container maxWidth='md'>
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
                <ServiceActionButton {...props} requestAccessHandler={handleOpen}/>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography color="textSecondary">{service.description}</Typography>
                  <Link href={service.service_url}>{service.service_url}</Link>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Box>
                <Typography component="div" variant="h5">Details</Typography>
                <Typography color="textSecondary"><Markdown>{service.about}</Markdown></Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
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
              <Divider />
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
              <Divider />
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
      <RequestAccessDialog {...props} open={open} handleClose={handleClose} handleSubmit={handleSubmit}/>
    </Layout>
  )
}

const RequestAccessDialog = props => {
  const questionText = props.service.questions && props.service.questions.length > 0 ?
    props.service.questions[0].question :
    `Would you like to request access to {props.service.name}?`

  return (
    <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Request Access</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {questionText}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={props.handleClose} color="primary" onClick={props.handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

Service.getInitialProps = async (context) => {
  const { id } = context.query

  //FIXME move user request into Express middleware
  const user = await api.user()
  const service = await api.service(id)

  return { user, service }
}

export default Service