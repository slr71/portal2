import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Grid, Box, Divider, Typography, Button, Link, List, ListItem, ListItemText, ListItemAvatar, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import Layout from '../../components/Layout.js'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Workshop = props => {
  const workshop = props.workshop
  const classes = useStyles()

  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleSubmit = async () => {
    setDialogOpen(false)
    const response = await props.api.createWorkshopRequest(workshop.id)
    console.log(response)
  }

  return ( //FIXME break into pieces
    <Layout {...props}>
      <Container maxWidth='md'>
      <Paper elevation={3} className={classes.paper}>
          <Grid container spacing={4}>
            <Grid container item xs={12} justify="space-between">
              <Grid item>
                <Box display="flex">
                  <Typography component="h1" variant="h4" gutterBottom>{workshop.title}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" size="medium" onClick={handleOpenDialog}>ENROLL</Button>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography color="textSecondary">{workshop.description}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Box>
                <Typography component="div" variant="h5">Details</Typography>
                <Typography color="textSecondary"><Markdown>{workshop.about}</Markdown></Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Box>
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
              </Box>
            </Grid>
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

const RequestEnrollmentDialog = ({ open, workshop, handleClose, handleSubmit }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Request Access</DialogTitle>
      <DialogContent>
        <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.6)' }}>
          <p>
            Clicking <strong>Enroll</strong> will submit a request to be enrolled in the workshop.
            Upon enrollment, you will automatically be granted access to all services the workshop
            will be using.
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
  const workshop = await req.api.workshop(query.id)

  return { props: { api: req.api, user, workshop } }
}

export default Workshop