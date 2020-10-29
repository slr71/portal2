import { makeStyles, Container, Box, Button, Paper, Typography } from '@material-ui/core'
import { Layout, DateSpan } from '../../../components'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '3em',
    marginBottom: '2em'
  }
}))

const User = ({ user }) => {
  const classes = useStyles()

  return (
    <Layout title={user.username} breadcrumbs>
      <Container maxWidth='lg'>
        <br />

        <Paper elevation={3} className={classes.paper}>
          <Typography component="div" variant="h5">{`${user.first_name} ${user.last_name} (${user.username})`}</Typography> 
          <br />
          <div>Joined: <DateSpan date={user.date_joined} /></div>
          <div>ORCID: {user.orcid_id ? user.orcid_id : '<None>'}</div>
          <Button variant="contained" color="error" size="medium">DELETE</Button>
        </Paper>

        <Paper elevation={3} className={classes.paper}>
          <Typography component="div" variant="h5">Email</Typography> 
          <br />
          {user.emails.map((email, index) => (
            <div key={index}>{email.email} - {email.verified ? 'Verified' + (email.primary ? ', Primary' : '') : 'Unverified'}</div>
          ))}
        </Paper>

        <Paper elevation={3} className={classes.paper}>
          <Typography component="div" variant="h5">Mailing List Subscriptions</Typography> 
          <br />
          {user.emails.map(email => (
            <div>
              <Typography variant="subtitle2" color="textSecondary">{email.email}</Typography>
              <Box ml={2}>
                {email.mailing_lists && email.mailing_lists.length > 0 
                  ? email.mailing_lists.map((mailingList, index) => (
                      <div key={index}>{mailingList.name}</div>
                    ))
                  : '<None>'
                }
              </Box>
            </div>
          ))}
        </Paper>

        <Paper elevation={3} className={classes.paper}>
          <Typography component="div" variant="h5">Institution</Typography> 
          <br />
          <div>Company/Institution: {user.institution}</div>
          <div>Department: {user.department}</div>
          <div>Occupation: {user.occupation.name}</div>
          <div>Country: {user.region.country.name}</div>
          <div>Region: {user.region.name}</div>
        </Paper>

        <Paper elevation={3} className={classes.paper}>
          <Typography component="div" variant="h5">Research</Typography> 
          <br />
          <div>Research Area: {user.research_area.name}</div>
          <div>Funding Agency: {user.funding_agency.name}</div>
        </Paper>

        <Paper elevation={3} className={classes.paper}>
          <Typography component="div" variant="h5">Demographics</Typography> 
          <br />
          <div>Gender Identity: {user.gender.name}</div>
          <div>Ethnicity: {user.ethnicity.name}</div>
        </Paper>

        <Paper elevation={3} className={classes.paper}>
          <Typography component="div" variant="h5">Preferences</Typography> 
          <br />
          <div>How did you hear about us? {user.aware_channel.name}</div>
          <div>Receive the CyVerse Newsletter? {user.subscribe_to_newsletter ? 'Yes' : 'No'}</div>
          <div>Participate in a research study about your use of CyVerse applications and services? {user.participate_in_study ? 'Yes' : 'No'}</div>
        </Paper>

        <Paper elevation={3} className={classes.paper}>
          <Typography component="div" variant="h5">Services</Typography> 
          <br />
          {user.services && user.services.length > 0
            ? user.services.map((service, index) => (
                <div key={index}>{service.name} - {service.request.message}</div>
              ))
            : 'None'
          }      
        </Paper>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ req, query }) {
  const user = await req.api.user(query.id)
  return { props: { user } }
}

export default User