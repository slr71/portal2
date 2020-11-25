import { Link, Grid, Button, IconButton, Divider, Box, Typography } from '@material-ui/core'
import { Launch as LaunchIcon, HelpOutlineOutlined as HelpIcon } from '@material-ui/icons'
import { Layout, SummaryCard } from '../components'
import { useUser } from '../contexts/user'

const Services = (props) => {
  const [user] = useUser()
  const userServices = user.services
  const services = props.services

  const available = services.filter(s => s.approval_key != '' && !userServices.map(s => s.id).includes(s.id))
  const powered = services.filter(s => s.is_powered)

  const poweredByButton = 
    <IconButton 
      aria-label="delete" 
      onClick={(e) => { window.open("https://cyverse.org/powered-by-cyverse"); e.preventDefault() }} //FIXME hardcoded url
    >
      <HelpIcon fontSize="small" />
    </IconButton>

  return (
    <Layout title="Services">
    <Box mt={4}>
      <Typography variant="h6" component="h2">My Services</Typography>
      <Divider />
      <br />
      <MyServices services={userServices} />
      </Box>
      <Box mt={4}>
      <Typography variant="h6" component="h2">Available</Typography>
      <Divider />
      <br/>
      <AvailableServices services={available} />
      </Box>
      <Box mt={4}>
      <Typography variant="h6" component="h2">Powered by CyVerse{poweredByButton}</Typography>
      <Divider />
      <br />
      <PoweredServices services={powered} />
      </Box>
    </Layout>
  )
}

const MyServices = ({services}) => {
  if (services && services.length > 0)
    return (<ServiceGrid services={services} launch={true} />)

  return (
    <p>
    Looks like you don't have access to any services.
    If you request access to one, you'll find it here.
    </p>
  )
}

const AvailableServices = ({services}) => {
  if (services && services.length > 0)
    return (<ServiceGrid services={services} launch={false} />)

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

const PoweredServices = ({services}) => {
  if (services && services.length > 0)
    return (<ServiceGrid services={services} launch={true} />)

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

const ServiceGrid = ({ services, launch }) => (
  <Grid container spacing={3}>
    {services.map(service =>
      <Grid item key={service.id} xs={12} sm={12} md={6} lg={3} xl={2}>
        <Service {...service} launch={launch} />
      </Grid>
    )}
  </Grid>
)

const Service = ({ id, name, description, icon_url, service_url, launch }) => {
  const action = 
    launch
      ? <Button size="small" color="primary" onClick={(e) => { window.open(`${service_url}`); e.preventDefault() }}>
          LAUNCH
          <LaunchIcon style={{ fontSize: '1em', marginLeft: '0.5em' }} />
        </Button>
      : <Button size="small" color="primary" href={`services/${id}`}>
          REQUEST ACCESS 
        </Button>

  return (
    <Link underline='none' href={`services/${id}`}>
      <SummaryCard 
        title={name} 
        description={description} 
        iconUrl={icon_url}
        action={action}
      />
    </Link>
  )
}

export async function getServerSideProps({ req }) {
  const services = await req.api.services()
  return { props: { services } }
}

export default Services