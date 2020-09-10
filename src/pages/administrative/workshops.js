import Link from "next/link"
import { makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Grid, Button, Typography, TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { Layout, DateRange } from '../../components'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Workshops = props => {
  const classes = useStyles()

  return (
    <Layout>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography component="h1" variant="h4" gutterBottom>Workshops</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary">
                Create Workshop
              </Button> 
            </Grid>
          </Grid>
          <br />
          <WorkshopTable {...props} />
        </Paper>
      </Container>
    </Layout>
  )
}

const WorkshopTable = ({ workshops }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableBody>
        {workshops.map(workshop => (
          <Link key={workshop.id} href={`/administrative/workshops/${workshop.id}`}>
            <TableRow hover style={{cursor: 'pointer'}}>
              <TableCell>
                <div>
                  <Typography component="h1" variant="h6" gutterBottom>{workshop.title}</Typography>
                </div>
                <div>
                  Enrollment: <DateRange date1={workshop.enrollment_begins} date2={workshop.enrollment_ends} />
                </div>
                <div>
                  Workshop: <DateRange date1={workshop.start_date} date2={workshop.end_date} />
                </div>
              </TableCell>
            </TableRow>
          </Link>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export async function getServerSideProps({ req }) {
  const workshops = await req.api.workshops()
  return { props: { workshops } }
}

export default Workshops