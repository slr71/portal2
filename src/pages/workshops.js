import { Grid, Link, Box, makeStyles } from '@material-ui/core'
import { Event as EventIcon } from '@material-ui/icons'
import { DateRange, Layout, SummaryCard } from '../components'
import { useUser } from '../contexts/user'

const useStyles = makeStyles((theme) => ({
  nowrap: {
    whiteSpace: 'nowrap'
  }
}))

const Workshops = props => {
  const user = useUser()
  const userWorkshops = user.workshops
  const otherWorkshops = props.workshops.filter(w => !userWorkshops.find(uw => uw.id == w.id))

  const timeNow = Date.now()
  const mine = userWorkshops.filter(w => new Date(w.enrollment_ends).getTime() > timeNow)
  const past = userWorkshops.filter(w => new Date(w.enrollment_ends).getTime() <= timeNow)
  const upcoming = otherWorkshops.filter(w => new Date(w.enrollment_ends).getTime() > timeNow)

  return (
    <Layout title="Workshops">
      <Box>
        <h2>My Workshops</h2>
        <MyWorkshops workshops={mine} />
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

const UpcomingWorkshops = ({ workshops }) => {
  if (workshops.length > 0)
    return (<WorkshopGrid workshops={workshops} />)

  return (<p>No upcoming workshops.</p>)
}

const PastWorkshops = ({ workshops }) => {
  if (workshops.length > 0)
    return (<WorkshopGrid workshops={workshops} />)

  return (<p>Looks like you haven't attended any workshops.</p>)
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
  const classes = useStyles()
  const user = useUser()
  const action = 
    user.id == workshop.creator_id
      ? 'You are the workshop host'
      : null

  return (
    <Link underline='none' href={`workshops/${workshop.id}`}>
      <SummaryCard 
        title={workshop.title} 
        subtitle={
          <>
            <div className={classes.noWrap}>
              Enrollment: <DateRange date1={workshop.enrollment_begins} date2={workshop.enrollment_ends} />
            </div>
            <div className={classes.noWrap}>
              Workshop: <DateRange date1={workshop.start_date} date2={workshop.end_date} />
            </div>
          </>
        }
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