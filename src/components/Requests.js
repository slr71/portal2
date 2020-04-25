import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';

const Requests = props => (
  <div>
    {props.requests
      .filter(request => request.forms.length > 0)
      .map(request => (
        <div>
          <h2>{request.name}</h2>
          <div>{request.description}</div>
          <br />
          <RequestGrid forms={request.forms} />
        </div>
    ))}
  </div>
);

function RequestGrid(props) {
  const forms = props.forms;

  return (
    <Grid container spacing={3}>
      {forms.map(form =>
        <Request form={form} />
      )}
    </Grid>
  );
}

function Request(props) {
  const form = props.form;

  return (
    <Grid item xs={6} key={form.id}>
      <Card>
        <Paper> {/*className={fixedHeightPaper}>*/}
          <div>{form.name}</div>
          <br />
          <div>{form.description}</div>
        </Paper>
      </Card>
    </Grid>
  )
}

export default Requests;