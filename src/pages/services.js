import fetch from 'isomorphic-unfetch'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Layout from '../components/Layout'
import SummaryCard from '../components/SummaryCard'
import { apiBaseUrl } from '../config.json'

const LAUNCH = 'LAUNCH'
const REQUEST_ACCESS = 'REQUEST ACCESS'

const Services = props => (
  <Layout>
    <h2>My Services</h2>
    <MyServices {...props} action={LAUNCH} />
    <h2>Available</h2>
    <AvailableServices {...props} action={REQUEST_ACCESS} />
    <h2>Powered by CyVerse</h2>
    <PoweredServices {...props} action={LAUNCH} />
  </Layout>
)

function MyServices(props) {
  const services = props.user.services

  if (services.length > 0) {
    return <ServiceGrid services={services} action={props.action} />
  }

  return (
    <p>
    Looks like you don't have access to any services.
    If you request access to one, you'll find it here.
    </p>
  )
}

function AvailableServices(props) {
  const services = props.services
    .filter(service => service.approval_key != '')
    .filter(service => !props.user.services.map(service => service.id).includes(service.id))

  if (services.length > 0) {
    return <ServiceGrid services={services} action={props.action} />
  }

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

function PoweredServices(props) {
  const services = props.services
    .filter(service => service.powered_services.length > 0)

  if (services.length > 0) {
    return <ServiceGrid services={services} action={props.action} />
  }

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

function ServiceGrid(props) {
  const services = props.services

  return (
    <Grid container spacing={4}>
      {services.map(service =>
        <Grid item xs={4} key={service.id}>
          <Service service={service} action={props.action} />
        </Grid>
      )}
    </Grid>
  )
}

function Service(props) {
  const service = props.service

  return (
    <Link underline='none' href={`services/${service.id}`}>
      <SummaryCard 
      title={service.name} 
      description={service.description} 
      iconUrl={service.icon_url}
      actionLabel={props.action}
      actionUrl={service.service_url}
      />
    </Link>
  )
}

export async function getServerSideProps() {
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/services`)
  const services = await res.json()

  return { 
    props: { 
      user,
      services
    } 
  }
}

export default Services