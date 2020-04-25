import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const Workshops = props => (
  <div>
    <h2>My Workshops</h2>
    <MyWorkshops {...props} />
    <h2>Hosted</h2>
    <HostedWorkshops {...props} />
    <h2>Upcoming Workshops</h2>
    <UpcomingWorkshops {...props} />
    <h2>Past Workshops</h2>
    <PastWorkshops {...props} />
  </div>
);

function MyWorkshops(props) {
  const workshops = props.user.workshops.filter(workshop => workshop.creator_id != props.user.id);

  if (workshops.length > 0) {
    return <WorkshopGrid workshops={workshops} />;
  }

  return (
    <p>
    Looks like you aren't attending any workshops.
    If you enroll in one, you'll find it here.
    </p>
  )
}

function HostedWorkshops(props) {
  const workshops = props.user.workshops.filter(workshop => workshop.creator_id == props.user.id);
  const button = <Button variant="contained" color="primary">Host A Workshop</Button>;

  if (props.user.workshops.length > 0) {
    return (
      <div>
        {button}
        <WorkshopGrid workshops={workshops} />
      </div>
    );
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
  const timeNow = Date.now();

  const workshops = props.workshops.filter(workshop => {
    const date = new Date(workshop.start_date);
    return date.getTime() > timeNow;
  });

  if (workshops.length > 0) {
    return <WorkshopGrid workshops={workshops} />;
  }

  return (
    <p>
    No upcoming workshops.
    </p>
  )
}

function PastWorkshops(props) {
  const timeNow = Date.now();

  const workshops = props.workshops.filter(workshop => {
    const date = new Date(workshop.start_date);
    return date.getTime() < timeNow;
  });

  if (workshops.length > 0) {
    return <WorkshopGrid workshops={workshops} />;
  }

  return (
    <p>
    No past workshops.
    </p>
  )
}

function WorkshopGrid(props) {
  const workshops = props.workshops;

  return (
    <Grid container spacing={3}>
      {workshops.map(workshop =>
        <Workshop workshop={workshop} />
      )}
    </Grid>
  );
}

function Workshop(props) {
  const workshop = props.workshop;

  return (
    <Grid item xs={6} key={workshop.id}>
      <Card>
        <Paper> {/*className={fixedHeightPaper}>*/}
          <div>{workshop.title}</div>
          <div>
            Enrollment: <DateString date={workshop.enrollment_begins} /> - <DateString date={workshop.enrollment_ends} />
          </div>
          <br />
          <div>{workshop.description}</div>
        </Paper>
      </Card>
    </Grid>
  )
}

function DateString(props) {
    const d = new Date(props.date);
    const month = d.toLocaleString('default', { month: 'short' });
    const day = d.getDate();
    const year = d.getFullYear();

  return <span>{month} {day}, {year}</span>;
}

export default Workshops;