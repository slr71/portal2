import fetch from 'isomorphic-unfetch';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Layout from '../components/Layout';
import { apiBaseUrl } from '../config.json';

const Requests = props => (
  <Layout>
    {props.requests
      .filter(request => request.forms.length > 0)
      .map(request => (
        <div key={request.name}>
          <h2>{request.name}</h2>
          <div>{request.description}</div>
          <br />
          <RequestGrid forms={request.forms} />
        </div>
    ))}
  </Layout>
);

function RequestGrid(props) {
  const forms = props.forms;

  return (
    <Grid container spacing={3}>
      {forms.map(form =>
        <Request key={form.id} form={form} />
      )}
    </Grid>
  );
}

function Request(props) {
  const form = props.form;

  return (
    <Grid item xs={6}>
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

export async function getServerSideProps() {
  let res = await fetch(apiBaseUrl + `/users/mine`);
  const user = await res.json();

  res = await fetch(apiBaseUrl + `/requests`);
  const requests = await res.json();

  return { 
    props: { 
      user: user,
      requests: requests
    } 
  };
};

export default Requests;