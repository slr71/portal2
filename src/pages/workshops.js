import { Grid, Link, Box, Divider, Typography, makeStyles } from '@material-ui/core'
import { Event as EventIcon } from '@material-ui/icons'
import { DateRange, Layout, SummaryCard } from '../components'
import { useUser } from '../contexts/user'
import { withGetServerSideError } from '../contexts/error'

const useStyles = makeStyles((theme) => ({
  nowrap: {
    whiteSpace: 'nowrap'
  }
}))

const Workshops = (props) => {
  const [user] = useUser()
  const userWorkshops = [].concat(
    user.workshops, // workshop user is/was enrolled in
    props.workshops.filter(w => 
      !user.workshops.find(uw => uw.id == w.id) && // skip duplicates
      (w.creator_id == user.id || 
        (w.organizers && w.organizers.some(o => o.id == user.id)))
    ) // workshop user is/was hosting/organizer
  )
  const otherWorkshops = props.workshops.filter(w => !userWorkshops.find(w2 => w2.id == w.id)) 

  const timeNow = Date.now()
  const mine = userWorkshops.filter(w => new Date(w.enrollment_ends).getTime() > timeNow)
  const past = userWorkshops.filter(w => new Date(w.enrollment_ends).getTime() <= timeNow)
  const upcoming = otherWorkshops.filter(w => new Date(w.enrollment_ends).getTime() > timeNow)

  return (
    <Layout title="Workshops">
      <Box mt={3}>
        <Typography variant="h6" component="h2">My Workshops</Typography>
        <Divider />
        <br />
        <MyWorkshops workshops={mine} />
        <br />
      </Box>
      <Box mt={3}>
        <Typography variant="h6" component="h2">Upcoming Workshops</Typography>
        <Divider />
        <br />
        <UpcomingWorkshops workshops={upcoming} />
        <br />
      </Box>
      <Box mt={3}>
        <Typography variant="h6" component="h2">Past Workshops</Typography>
        <Divider />
        <br />
        <PastWorkshops workshops={past} />
        <br />
      </Box>
    </Layout>
  )
}

const MyWorkshops = ({ workshops }) => {
  const content =
    workshops.length > 0
    ? <WorkshopGrid workshops={workshops} />
    : <Typography variant="body1">
        Looks like you aren't attending any workshops.
        If you enroll in one, you'll find it here.
      </Typography>

  return (
    <div>
      {content}
      <br />
      <Typography variant="body1">To host your own workshop use the <Link href='requests/8'>request form</Link>.</Typography>
    </div>
  )
}

const UpcomingWorkshops = ({ workshops }) => {
  if (workshops.length > 0)
    return <WorkshopGrid workshops={workshops} />

  return <Typography variant="body1">No upcoming workshops.</Typography>
}

const PastWorkshops = ({ workshops }) => {
  if (workshops.length > 0)
    return <WorkshopGrid workshops={workshops} />

  return <Typography variant="body1">Looks like you haven't attended any workshops.</Typography>
}

const WorkshopGrid = ({ workshops }) => (
  <Grid container spacing={4}>
    {workshops.map((workshop, index) =>
      <Grid item key={index} xs={12} sm={12} md={6} lg={5} xl={4}>
        <Workshop workshop={workshop} />
      </Grid>
    )}
  </Grid>
)

const Workshop = ({ workshop }) => {
  const classes = useStyles()
  const [user] = useUser()
  const isHost = user.id == workshop.creator_id
  const isOrganizer = workshop.organizers && workshop.organizers.some(o => o.id == user.id)

  return (
    <Link underline='none' href={`workshops/${workshop.id}`}>
      <SummaryCard 
        title={workshop.title} 
        subtitle={
          <>
            <div className={classes.noWrap}>
              Enrollment: <DateRange date1={workshop.enrollment_begins} date2={workshop.enrollment_ends} hideTime />
            </div>
            <div className={classes.noWrap}>
              Workshop: <DateRange date1={workshop.start_date} date2={workshop.end_date} />
            </div>
          </>
        }
        description={workshop.description}
        icon={<EventIcon />}
        action={
          isHost 
            ? <b>You are the workshop host</b>
            : (isOrganizer ? <b>You are a workshop organizer</b> : null)
        }
        largeHeader
      />
    </Link>
  )
}

export const getServerSideProps = withGetServerSideError(
  async ({ req }) => {
    const workshops = await req.api.workshops()
    return { props: { workshops } }
  }
)

export default Workshops