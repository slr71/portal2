import { Link, Grid } from '@material-ui/core'
import { Layout, SummaryCard } from '../components'
import PortAPI from '../api'
import PortalAPI from '../api'

const Services = props => {
  const userServices = props.user.services
  const services = props.services

  const available = services.filter(s => s.approval_key != '' && !userServices.map(s => s.id).includes(s.id))
  const powered = services.filter(s => s.is_powered)

  return (
    <Layout title="Services" {...props}>
      <h2>My Services</h2>
      <MyServices services={userServices} />
      <h2>Available</h2>
      <AvailableServices services={available} />
      <h2>Powered by CyVerse</h2>
      <PoweredServices services={powered} />
    </Layout>
  )
}

const MyServices = ({services}) => {
  if (services && services.length > 0)
    return (<ServiceGrid services={services} />)

  return (
    <p>
    Looks like you don't have access to any services.
    If you request access to one, you'll find it here.
    </p>
  )
}

const AvailableServices = ({services}) => {
  if (services && services.length > 0)
    return (<ServiceGrid services={services} />)

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

const PoweredServices = ({services}) => {
  if (services && services.length > 0)
    return (<ServiceGrid services={services} />)

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

const ServiceGrid = ({ services }) => (
  <Grid container spacing={4}>
    {services.map(service =>
      <Grid item xs={12} sm={6} md={3} lg={4} xl={2} key={service.id}>
        <Service service={service} />
      </Grid>
    )}
  </Grid>
)

const Service = ({ service }) => {
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

export async function getServerSideProps({ req }) {
  const api = new PortalAPI({req})
  const user = await api.user() //FIXME move user request into React context
  const services = await api.services()

  return { props: { user, services } }
}

export default Services