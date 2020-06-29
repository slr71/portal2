import { makeStyles } from '@material-ui/core/styles'
import { Card, CardHeader, CardContent, Typography, Button, Avatar } from '@material-ui/core'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  box: {
    marginBottom: '2em'
  }
}))

const User = (props) => (
  <div>
    <Card className={useStyles().box}>
      <CardHeader
        title={`${props.user.first_name} ${props.user.last_name} (${props.user.username})`}
        // subheader={props.subtitle}
      />
      <CardContent>
        <div>Joined: {props.user.date_joined}</div>
        <div>ORCID: {props.user.orcid_id ? props.user.orcid_id : '<None>'}</div>
        {props.delete ? <Button variant="contained" color="secondary" size="medium">DELETE</Button> : <></>}
      </CardContent>
    </Card>

    <Card className={useStyles().box}>
      <CardHeader
        title="Email"
        // subheader={props.subtitle}
      />
      <CardContent>
        {props.user.emails.map((email, index) => (
          <div key={index}>{email.email} - {[email.verified ? 'Verified' : '', email.primary ? 'Primary' : ''].join(', ')}</div>
        ))}
      </CardContent>
    </Card>

    {props.allSections || props.mailingLists ? 
      <Card className={useStyles().box}>
      <CardHeader
        title="Mailing List Subscriptions"
        // subheader={props.subtitle}
      />
      <CardContent>
        {props.user.emails[0].mailing_lists.map((mailingList, index) => (
          <div key={index}>{mailingList.name}</div>
        ))}
      </CardContent>
      </Card>
      : <></>
    }

    {props.allSections || props.institution ? 
      <Card className={useStyles().box}>
        <CardHeader
          title="Institution"
          // subheader={props.subtitle}
        />
        <CardContent>
          <div>Company/Institution: {props.user.institution}</div>
          <div>Department: {props.user.department}</div>
          <div>Occupation: {props.user.occupation.name}</div>
          <div>Country: {props.user.region.country.name}</div>
          <div>Region: {props.user.region.name}</div>
        </CardContent>
      </Card>
      : <></>
    }

    {props.allSections || props.research ? 
      <Card className={useStyles().box}>
        <CardHeader
          title="Research"
          // subheader={props.subtitle}
        />
        <CardContent>
          <div>Research Area: {props.user.research_area.name}</div>
          <div>Funding Agency: {props.user.funding_agency.name}</div>
        </CardContent>
      </Card>
      : <></>
    }

    {props.allSections || props.demographics ? 
      <Card className={useStyles().box}>
        <CardHeader
          title="Demographics"
          // subheader={props.subtitle}
        />
        <CardContent>
          <div>Gender Identity: {props.user.gender.name}</div>
          <div>Ethnicity: {props.user.ethnicity.name}</div>
        </CardContent>
      </Card>
      : <></>
    }

    {props.allSections || props.preferences ? 
      <Card className={useStyles().box}>
        <CardHeader
          title="Preferences"
          // subheader={props.subtitle}
        />
        <CardContent>
            <div>How did you hear about us? {props.user.aware_channel.name}</div>
            <div>Receive the CyVerse Newsletter? {props.user.subscribe_to_newsletter ? 'Yes' : 'No'}</div>
            <div>Participate in a research study about your use of CyVerse applications and services? {props.user.participate_in_study ? 'Yes' : 'No'}</div>
        </CardContent>
      </Card>
      : <></>
    }

    {props.allSections || props.services ? 
      <Card className={useStyles().box}>
        <CardHeader
          title="Services"
          // subheader={props.subtitle}
        />
        <CardContent>
          {props.user.services.map((service, index) => (
              <div key={index}>{service.name} - {service.api_accessrequest.message}</div>
          ))}      
        </CardContent>
      </Card>
      : <></>
    }
  </div>
)

export default User