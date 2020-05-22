import { makeStyles } from '@material-ui/core/styles'
import { Paper, Box, Typography, Button, Avatar } from '@material-ui/core'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '1em 1em 2em 2em'
  },
  box: {
    marginBottom: '2em'
  }
}))

const User = (props) => (
  <div>
    <Box className={useStyles().box}>
      <Paper elevation={3} className={useStyles().paper}>
        <Typography component="h1" variant="h5">{props.user.first_name} {props.user.last_name} ({props.user.username})</Typography>
        <div>Joined: {props.user.date_joined}</div>
        <div>ORCID: {props.user.orcid_id ? props.user.orcid_id : '<None>'}</div>
        <Button variant="contained" color="secondary" size="medium">DELETE</Button>
      </Paper>
    </Box>

    <Box className={useStyles().box}>
      <Paper elevation={3} className={useStyles().paper}>
        <Typography component="h1" variant="h5">Email</Typography>
        <ul>
        {props.user.emails.map(email => (
          <li>{email.email} - {[email.verified ? 'Verified' : '', email.primary ? 'Primary' : ''].join(', ')}</li>
        ))}
        </ul>
      </Paper>
    </Box>

    <Box className={useStyles().box}>
      <Paper elevation={3} className={useStyles().paper}>
        <Typography component="h1" variant="h5">Mailing List Subscriptions</Typography>
        <ul>
        {props.user.emails[0].mailing_lists.map(mailingList => (
          <li>{mailingList.name}</li>
        ))}
        </ul>
      </Paper>
    </Box>

    <Box className={useStyles().box}>
      <Paper elevation={3} className={useStyles().paper}>
        <Typography component="h1" variant="h5">Institution</Typography>
        <ul>
          <li>Company/Institution: {props.user.institution}</li>
          <li>Department: {props.user.department}</li>
          <li>Occupation: {props.user.occupation.name}</li>
          <li>Country: {props.user.region.country.name}</li>
          <li>Region: {props.user.region.name}</li>
        </ul>
      </Paper>
    </Box>

    <Box className={useStyles().box}>
      <Paper elevation={3} className={useStyles().paper}>
        <Typography component="h1" variant="h5">Research</Typography>
        <ul>
          <li>Research Area: {props.user.research_area.name}</li>
          <li>Funding Agency: {props.user.funding_agency.name}</li>
        </ul>
      </Paper>
    </Box>

    <Box className={useStyles().box}>
      <Paper elevation={3} className={useStyles().paper}>
        <Typography component="h1" variant="h5">Demographics</Typography>
        <ul>
          <li>Gender Identity: {props.user.gender.name}</li>
          <li>Ethnicity: {props.user.ethnicity.name}</li>
        </ul>
      </Paper>
    </Box>

    <Box className={useStyles().box}>
      <Paper elevation={3} className={useStyles().paper}>
        <Typography component="h1" variant="h5">Preferences</Typography>
        <ul>
          <li>How did you hear about us? {props.user.aware_channel.name}</li>
          <li>Receive the CyVerse Newsletter? {props.user.subscribe_to_newsletter ? 'Yes' : 'No'}</li>
          <li>Participate in a research study about your use of CyVerse applications and services? {props.user.participate_in_study ? 'Yes' : 'No'}</li>
        </ul>
      </Paper>
    </Box>

    <Box className={useStyles().box}>
      <Paper elevation={3} className={useStyles().paper}>
        <Typography component="h1" variant="h5">Services</Typography>
        <ul>
          {props.user.services.map(service => (
            <li>{service.name} - {service.api_accessrequest.message}</li>
          ))}      
        </ul>
      </Paper>
    </Box>
  </div>
)

export default User