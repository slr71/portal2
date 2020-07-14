import fetch from 'isomorphic-unfetch'
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Grid, Box, Divider, Typography, Button, Link, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'
import Layout from '../../components/Layout.js'
import { apiBaseUrl } from '../../config.json'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Workshop = props => {
  const workshop = props.workshop
  const classes = useStyles()

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
                <Button variant="contained" color="primary" size="medium">ENROLL</Button>
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
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query

  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/workshops/${id}`)
  const workshop = await res.json()

  return { props: { user, workshop } }
}

export default Workshop