import fetch from 'isomorphic-unfetch'
import { Grid, Link, Button } from '@material-ui/core'
import { DateRange, Layout, SummaryCard } from '../components'
import { apiBaseUrl } from '../config.json'

const Workshops = props => (
  <Layout {...props}>
    <h1>Workshops</h1>
    <h2>My Workshops</h2>
    <MyWorkshops {...props} />
    <h2>Hosted</h2>
    <HostedWorkshops {...props} />
    <h2>Upcoming Workshops</h2>
    <UpcomingWorkshops {...props} />
    <h2>Past Workshops</h2>
    <PastWorkshops {...props} />
  </Layout>
)

function MyWorkshops(props) {
  const workshops = props.user.workshops.filter(workshop => workshop.creator_id != props.user.id)

  if (workshops.length > 0) {
    return <WorkshopGrid workshops={workshops} />
  }

  return (
    <p>
    Looks like you aren't attending any workshops.
    If you enroll in one, you'll find it here.
    </p>
  )
}

function HostedWorkshops(props) {
  const workshops = props.user.workshops.filter(workshop => workshop.creator_id == props.user.id)
  const button = <Button variant="contained" color="primary">Host A Workshop</Button>

  if (props.user.workshops.length > 0) {
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
      If you'd like to host one, click the button below to discuss it with CyVerse staff.
      </p>
      {button}
    </div>
  )
}

function UpcomingWorkshops(props) {
  const timeNow = Date.now()

  const workshops = props.workshops.filter(workshop => {
    const date = new Date(workshop.start_date)
    return date.getTime() > timeNow
  })

  if (workshops.length > 0) {
    return <WorkshopGrid workshops={workshops} />
  }

  return (
    <p>
    No upcoming workshops.
    </p>
  )
}

function PastWorkshops(props) {
  const timeNow = Date.now()

  const workshops = props.workshops.filter(workshop => {
    const date = new Date(workshop.start_date)
    return date.getTime() < timeNow
  })

  if (workshops.length > 0) {
    return <WorkshopGrid workshops={workshops} />
  }

  return (
    <p>
    No past workshops.
    </p>
  )
}

function WorkshopGrid(props) {
  const workshops = props.workshops

  return (
    <Grid container spacing={3}>
      {workshops.map(workshop =>
        <Grid item xs={6} key={workshop.id}>
          <Workshop workshop={workshop} />
        </Grid>
      )}
    </Grid>
  )
}

function Workshop(props) {
  const workshop = props.workshop

  return (
    <Link underline='none' href={`workshops/${workshop.id}`}>
      <SummaryCard 
      title={workshop.title} 
      subtitle={<DateRange date1={workshop.enrollment_begins} date2={workshop.enrollment_ends} />}
      description={workshop.description} 
      />
    </Link>
  )
}

export async function getServerSideProps() {
  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/workshops`)
  const workshops = await res.json()

  return { 
    props: { 
      user,
      workshops
    } 
  }
}

export default Workshops