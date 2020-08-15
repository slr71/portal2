import { Grid, Button, Link } from '@material-ui/core'
import { DateRange, Layout, SummaryCard } from '../components'
import PortalAPI from '../api'

const Workshops = props => {
  const workshops = props.workshops
  const userWorkshops = props.user.workshops

  const timeNow = Date.now()
  const mine = userWorkshops.filter(w => w.creator_id != props.user.id)
  const hosted = userWorkshops.filter(w => w.creator_id == props.user.id)
  const upcoming = workshops.filter(w => new Date(w.start_date).getTime() > timeNow)
  const past = workshops.filter(w => new Date(w.start_date).getTime() <= timeNow)

  return (
    <Layout title="Workshops" {...props}>
      <h2>My Workshops</h2>
      <MyWorkshops workshops={mine} />
      <h2>Hosted</h2>
      <HostedWorkshops workshops={hosted} />
      <h2>Upcoming Workshops</h2>
      <UpcomingWorkshops workshops={upcoming} />
      <h2>Past Workshops</h2>
      <PastWorkshops workshops={past} />
    </Layout>
  )
}

const MyWorkshops = ({ workshops }) => {
  if (workshops.length > 0) 
    return (<WorkshopGrid workshops={workshops} />)

  return (
    <p>
      Looks like you aren't attending any workshops.
      If you enroll in one, you'll find it here.
    </p>
  )
}

const HostedWorkshops = ({ workshops }) => {  
  const button = <Button variant="contained" color="primary" href="requests/8">Host A Workshop</Button> //FIXME hardcoded url

  if (workshops.length > 0) {
    return (
      <div>
        {button}
        <WorkshopGrid workshops={workshops} />
      </div>
    )
  }

  return (
    <div>
      <p>
        Looks like you aren't hosting any workshops.
        If you'd like to host one, click the button below to submit a request.
      </p>
      {button}
    </div>
  )
}

const UpcomingWorkshops = ({ workshops }) => {
  if (workshops.length > 0)
    return (<WorkshopGrid workshops={workshops} />)

  return (<p>No upcoming workshops.</p>)
}

const PastWorkshops = ({ workshops }) => {
  if (workshops.length > 0)
    return (<WorkshopGrid workshops={workshops} />)

  return (<p>No past workshops.</p>)
}

const WorkshopGrid = ({ workshops }) => (
  <Grid container spacing={3}>
    {workshops.map(workshop =>
      <Grid item xs={6} key={workshop.id}>
        <Workshop workshop={workshop} />
      </Grid>
    )}
  </Grid>
)

const Workshop = ({ workshop }) => (
  <Link underline='none' href={`workshops/${workshop.id}`}>
    <SummaryCard 
      title={workshop.title} 
      subtitle={<DateRange date1={workshop.enrollment_begins} date2={workshop.enrollment_ends} />}
      description={workshop.description} 
    />
  </Link>
)

export async function getServerSideProps({ req }) {
  const api = new PortalAPI({req})
  const user = await api.user() //FIXME move user request into React context
  const workshops = await api.workshops()

  return { props: { user, workshops } }
}

export default Workshops