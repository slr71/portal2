import Layout from '../../components/Layout.js'
import { apiBaseUrl } from '../../config.json';

const User = props => (
  <Layout>
    <h1>{props.user.first_name} {props.user.last_name} ({props.user.username})</h1>
    <div>Joined: {props.user.date_joined}</div>

    <h2>Email</h2>
    <ul>
    {props.user.emails.map(email => (
      <li>{email.email} - {[email.verified ? 'Verified' : '', email.primary ? 'Primary' : ''].join(', ')}</li>
    ))}
    </ul>

    <h2>Mailing List Subscriptions</h2>
   <ul>
   {props.user.emails[0].mailing_lists.map(mailingList => (
     <li>{mailingList.name}</li>
   ))}
   </ul>

    <h2>Institution</h2>
    <ul>
      <li>Company/Institution: {props.user.institution}</li>
      <li>Department: {props.user.department}</li>
      <li>Occupation: {props.user.occupation.name}</li>
      <li>Country: {props.user.region.country.name}</li>
      <li>Region: {props.user.region.name}</li>
    </ul>

    <h2>Research</h2>
    <ul>
    <li>Research Area: {props.user.research_area.name}</li>
    <li>Funding Agency: {props.user.funding_agency.name}</li>
    </ul>

    <h2>ORCID</h2>
    <ul>
    <li>{props.user.orcid_id ? props.user.orcid_id : '<None>'}</li>
    </ul>

    <h2>Demographics</h2>
    <ul>
    <li>Gender Identity: {props.user.gender.name}</li>
    <li>Ethnicity: {props.user.ethnicity.name}</li>
    </ul>

    <h2>Preferences</h2>
    <ul>
   <li>How did you hear about us? {props.user.aware_channel.name}</li>
      <li>Receive the CyVerse Newsletter? {props.user.subscribe_to_newsletter ? 'Yes' : 'No'}</li>
      <li>Participate in a research study about your use of CyVerse applications and services? {props.user.participate_in_study ? 'Yes' : 'No'}</li>
    </ul>

    <h2>Services</h2>
    <ul>
    {props.user.services.map(service => (
      <li>{service.name} - {service.api_accessrequest.message}</li>
    ))}      
    </ul>

    <h2>Delete User</h2>
    <div>TODO</div>
  </Layout>
);

User.getInitialProps = async function(context) {
  const { id } = context.query;
  const res = await fetch(apiBaseUrl + `/users/${id}`);
  const user = await res.json();

  console.log(`Fetched user: ${user.username}`);

  return { user };
};

export default User;