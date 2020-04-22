import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';

const Services = props => (
  <div>
    <h2>My Services</h2>
    <Grid container spacing={3}>
        {props.user.services.map(service => (
          <Grid item xs={4}>
            <Card>
              <Paper> {/*className={fixedHeightPaper}>*/}
                <div>{service.name}</div>
                <br />
                <div>{service.description}</div>
                <br />
                <a href={service.service_url} target="_blank">LAUNCH</a>
              </Paper>
            </Card>
          </Grid>
        ))}
    </Grid>
    <h2>Available</h2>
    <Grid container spacing={3}>
        {props.services
          .filter(service => service.approval_key != '')
          .filter(service => !props.user.services.map(service => service.id).includes(service.id))
          .map(service => (
            <Grid item xs={4}>
              <Card>
                <Paper> {/*className={fixedHeightPaper}>*/}
                  <div>{service.name}</div>
                  <br />
                  <div>{service.description}</div>
                  <br />
                  <a href={service.service_url} target="_blank">LAUNCH</a>
                </Paper>
              </Card>
            </Grid>
          ))}
    </Grid>
    <h2>Powered by CyVerse</h2>
    <Grid container spacing={4}>
        {props.services
          .filter(service => service.powered_services.length > 0)
          .map(service => (
            <Grid item xs={4}>
              <Card>
                <Paper> {/*className={fixedHeightPaper}>*/}
                  <div>{service.name}</div>
                  <br />
                  <div>{service.description}</div>
                  <br />
                  <a href={service.service_url} target="_blank">LAUNCH</a>
                </Paper>
              </Card>
            </Grid>
          ))}
    </Grid>
  </div>
);

export default Services;