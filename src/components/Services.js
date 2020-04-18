import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';

const Services = props => (
  <div>
    <h2>My Services</h2>
    <Grid container spacing={3}>
        {props.user.services.map(service => (
          <Grid item xs>
            <Card>
              <Paper> {/*className={fixedHeightPaper}>*/}
              {service.name}
              </Paper>
            </Card>
          </Grid>
        ))}
    </Grid>
    <h2>Available</h2>
    <Grid container spacing={3}>
        {props.services.map(service => (
          <Grid item xs>
            <Card>
              <Paper> {/*className={fixedHeightPaper}>*/}
              {service.name}
              </Paper>
            </Card>
          </Grid>
        ))}
    </Grid>
    <h2>Powered by CyVerse</h2>
  </div>
);

export default Services;