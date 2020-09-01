import { Grid, Link, Box } from '@material-ui/core'
import { Event as EventIcon } from '@material-ui/icons'
import { DateRange, Layout, SummaryCard } from '../components'
import { useUser } from '../contexts/user'

const Workshops = props => {
  const user = useUser()
  const userWorkshops = user.workshops
  const workshops = props.workshops.filter(w => !userWorkshops.find(uw => uw.id == w.id))

  const timeNow = Date.now()
  const upcoming = workshops.filter(w => new Date(w.start_date).getTime() > timeNow)
  const past = workshops.filter(w => new Date(w.start_date).getTime() <= timeNow)

  return (
    <Layout title="Workshops">
      <Box>
        <h2>My Workshops</h2>
        <MyWorkshops workshops={userWorkshops} />
      </Box>
      <Box mt={4}>
        <h2>Upcoming Workshops</h2>
        <UpcomingWorkshops workshops={upcoming} />
      </Box>
      <Box mt={4}>
        <h2>Past Workshops</h2>
        <PastWorkshops workshops={past} />
      </Box>
    </Layout>
  )
}

const MyWorkshops = ({ workshops }) => {
  const content =
    workshops.length > 0
    ? <WorkshopGrid workshops={workshops} />
    : <p>
        Looks like you aren't attending any workshops.
        If you enroll in one, you'll find it here.
      </p>

  return (
    <div>
      {content}
      <p>To host your own workshop use the <Link href='requests/8'>request form</Link>.</p>
    </div>
  )
}

// const HostedWorkshops = ({ workshops }) => {  
//   const button = <Button variant="contained" color="primary" href="requests/8">Host A Workshop</Button> //FIXME hardcoded url

//   if (workshops.length > 0) {
//     return (
//       <div>
//         {button}
//         <WorkshopGrid workshops={workshops} />
//       </div>
//     )
//   }

//   return (
//     <div>
//       <p>
//         Looks like you aren't hosting any workshops.
//         If you'd like to host one, click the button below to submit a request.
//       </p>
//       {button}
//     </div>
//   )
// }

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

const Workshop = ({ workshop }) => {
  const user = useUser()
  const action = 
    user.id == workshop.creator_id
      ? 'You are the workshop host'
      : null

  return (
    <Link underline='none' href={`workshops/${workshop.id}`}>
      <SummaryCard 
        title={workshop.title} 
        subtitle={<DateRange date1={workshop.enrollment_begins} date2={workshop.enrollment_ends} />}
        description={workshop.description} 
        icon={<EventIcon />}
        action={action}
      />
    </Link>
  )
}

export async function getServerSideProps({ req }) {
  const workshops = await req.api.workshops()
  return { props: { workshops } }
}

export default Workshops