import { Link, Grid, Button, IconButton, Divider, Box, Typography } from '@material-ui/core'
import { Launch as LaunchIcon, HelpOutlineOutlined as HelpIcon } from '@material-ui/icons'
import { Layout, SummaryCard } from '../components'
import { useUser } from '../contexts/user'
import { withGetServerSideError } from '../contexts/error'
const inlineIcons = require('../inline_icons.json')
import WelcomeBanner from '../components/welcomeBanner'

const Services = (props) => {
  const [user] = useUser()
  const userServices = user.services.filter(s => s.api_accessrequest.status != 'denied')
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
      <Box mt={3}>
      <WelcomeBanner />
      </Box>
      <Box mt={3}>
        <Typography variant="h6" component="h2">My Services</Typography>
        <Divider />
        <br />
        <MyServices services={userServices} />
        <br />
      </Box>
      <Box mt={3}>
        <Typography variant="h6" component="h2">Available</Typography>
        <Divider />
        <br />
        <AvailableServices services={available} />
        <br />
      </Box>
      <Box mt={3}>
        <Typography variant="h6" component="h2">Powered by CyVerse{poweredByButton}</Typography>
        <Divider />
        <br />
        <PoweredServices services={powered} />
        <br />
      </Box>
    </Layout>
  )
}

const MyServices = ({services}) => {
  if (services && services.length > 0)
    return <ServiceGrid services={services} launch={true} />

  return (
    <Typography variant="body1">
      Looks like you don't have access to any services.
      If you request access to one, you'll find it here.
    </Typography>
  )
}

const AvailableServices = ({services}) => {
  if (services && services.length > 0)
    return <ServiceGrid services={services} launch={false} />

  return <Typography variant="body1">There are no additional services available.</Typography>
}

const PoweredServices = ({services}) => {
  if (services && services.length > 0)
    return <ServiceGrid services={services} launch={true} />

  return <Typography variant="body1">There are no additional services available.</Typography>
}

const ServiceGrid = ({ services, launch }) => (
  <Grid container spacing={4}>
    {services.map((service, index) =>
      <Grid item key={index} xs={12} sm={12} md={6} lg={4} xl={2}>
        <Service {...service} launch={launch} />
      </Grid>
    )}
  </Grid>
)

const Service = ({ id, name, description, icon_url, service_url, launch }) => {
  const action = 
    launch
      ? name == 'Discovery Environment' // temporary kluge for DE 2.0
        ? <>
            <Button size="small" color="primary" onClick={(e) => { window.open(`${service_url}`); e.preventDefault() }}>
              LAUNCH
              <LaunchIcon style={{ fontSize: '1em', marginLeft: '0.5em' }} />
            </Button>
            <Button size="small" color="primary" onClick={(e) => { window.open('http://de2.cyverse.org'); e.preventDefault() }}>
              LAUNCH 2.0
              <LaunchIcon style={{ fontSize: '1em', marginLeft: '0.5em' }} />
            </Button>
          </>
        : <Button size="small" color="primary" onClick={(e) => { window.open(`${service_url}`); e.preventDefault() }}>
            LAUNCH
            <LaunchIcon style={{ fontSize: '1em', marginLeft: '0.5em' }} />
          </Button>
      : <Button size="small" color="primary" href={`services/${id}`}>
          REQUEST ACCESS 
        </Button>

  // Icons were moved inline for performance
  if (icon_url in inlineIcons)
    icon_url = inlineIcons[icon_url] // replace with inline image data

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