import { Link, Grid } from '@material-ui/core'
import { Layout, SummaryCard } from '../components'
import api from '../api'


const Services = props => (
  <Layout title="Services" {...props}>
    <h2>My Services</h2>
    <MyServices {...props} />
    <h2>Available</h2>
    <AvailableServices {...props} />
    <h2>Powered by CyVerse</h2>
    <PoweredServices {...props} />
  </Layout>
)

function MyServices(props) {
  const user = props.user
  const services = props.user.services

  if (services.length > 0) {
    return <ServiceGrid services={services} user={user} />
  }

  return (
    <p>
    Looks like you don't have access to any services.
    If you request access to one, you'll find it here.
    </p>
  )
}

function AvailableServices(props) {
  const user = props.user
  const services = props.services
    .filter(service => service.approval_key != '')
    .filter(service => !props.user.services.map(service => service.id).includes(service.id))

  if (services.length > 0) {
    return <ServiceGrid services={services} user={user} />
  }

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

function PoweredServices(props) {
  const services = props.services
    .filter(service => service.is_powered)

  if (services.length > 0) {
    return <ServiceGrid services={services} user={props.user} />
  }

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

function ServiceGrid(props) {
  const { user, services } = props

  return (
    <Grid container spacing={4}>
      {services.map(service =>
        <Grid item xs={12} sm={6} md={3} lg={4} xl={2} key={service.id}>
          <Service service={service} user={user} />
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
      actionLabel='TODO'
      actionUrl={service.service_url}
      />
    </Link>
  )
}

Services.getInitialProps = async (context) => {
  //FIXME move user request into Express middleware
  const user = await api.user()
  const services = await api.services()

  return { user, services }
}

export default Services