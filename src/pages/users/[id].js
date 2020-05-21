import fetch from 'isomorphic-unfetch'
import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper } from '@material-ui/core'
import Layout from '../../components/Layout.js'
import { apiBaseUrl } from '../../config.json'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const User = props => (
  <Layout {...props}>
    <Container maxWidth='lg'>
      <Paper elevation={3} className={useStyles().paper}>
        <h1>{props.targetUser.first_name} {props.targetUser.last_name} ({props.targetUser.username})</h1>
        <div>Joined: {props.targetUser.date_joined}</div>

        <h2>Email</h2>
        <ul>
        {props.targetUser.emails.map(email => (
          <li>{email.email} - {[email.verified ? 'Verified' : '', email.primary ? 'Primary' : ''].join(', ')}</li>
        ))}
        </ul>

        <h2>Mailing List Subscriptions</h2>
      <ul>
      {props.targetUser.emails[0].mailing_lists.map(mailingList => (
        <li>{mailingList.name}</li>
      ))}
      </ul>

        <h2>Institution</h2>
        <ul>
          <li>Company/Institution: {props.targetUser.institution}</li>
          <li>Department: {props.targetUser.department}</li>
          <li>Occupation: {props.targetUser.occupation.name}</li>
          <li>Country: {props.targetUser.region.country.name}</li>
          <li>Region: {props.targetUser.region.name}</li>
        </ul>

        <h2>Research</h2>
        <ul>
        <li>Research Area: {props.targetUser.research_area.name}</li>
        <li>Funding Agency: {props.targetUser.funding_agency.name}</li>
        </ul>

        <h2>ORCID</h2>
        <ul>
        <li>{props.targetUser.orcid_id ? props.targetUser.orcid_id : '<None>'}</li>
        </ul>

        <h2>Demographics</h2>
        <ul>
        <li>Gender Identity: {props.targetUser.gender.name}</li>
        <li>Ethnicity: {props.targetUser.ethnicity.name}</li>
        </ul>

        <h2>Preferences</h2>
        <ul>
      <li>How did you hear about us? {props.targetUser.aware_channel.name}</li>
          <li>Receive the CyVerse Newsletter? {props.targetUser.subscribe_to_newsletter ? 'Yes' : 'No'}</li>
          <li>Participate in a research study about your use of CyVerse applications and services? {props.targetUser.participate_in_study ? 'Yes' : 'No'}</li>
        </ul>

        <h2>Services</h2>
        <ul>
        {props.targetUser.services.map(service => (
          <li>{service.name} - {service.api_accessrequest.message}</li>
        ))}      
        </ul>

        <h2>Delete User</h2>
        <div>TODO</div>
      </Paper>
    </Container>
  </Layout>
)

User.getInitialProps = async function(context) {
  const { id } = context.query

  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/users/${id}`)
  const targetUser = await res.json()

  return { user, targetUser }
}

export default User