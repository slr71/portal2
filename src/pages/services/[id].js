import fetch from 'isomorphic-unfetch'
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import Layout from '../../components/Layout.js'
import { apiBaseUrl } from '../../config.json'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Service = props => {
  const service = props.service
  const classes = useStyles()

  return ( //FIXME break into pieces
    <Layout>
      <Container maxWidth='md'>
        <Paper elevation={3} className={classes.paper}>
          <Grid container spacing={4}>
            <Grid container item xs={12} justify="space-between">
              <Grid item >
                <Box display='flex'>
                  <Avatar alt={service.name} src={service.icon_url} />
                  <Typography component="h1" variant="h4" gutterBottom>{service.name}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" size="medium">LAUNCH</Button>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography color="textSecondary">{service.description}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Box>
                <Typography component="div" variant="h5">About</Typography>
                <Markdown>{service.about}</Markdown>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Box>
                <Typography component="div" variant="h5">Contacts</Typography>
                <Typography color="textSecondary">Contact(s) for questions or problems.</Typography>
                <List>
                  {service.contacts.map(contact => (
                    <ListItem key={contact.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={contact.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Box>
                <Typography component="div" variant="h5">Resources</Typography>
                <Typography color="textSecondary">Where you can find support.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Box>
                <Typography component="div" variant="h5">Requests</Typography>
                <Typography color="textSecondary">Requests you can submit related to this service.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  )
}

Service.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(apiBaseUrl + `/services/${id}`)
  const service = await res.json()

  return { service }
}

export default Service