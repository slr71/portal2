import fetch from 'isomorphic-unfetch';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Layout from '../components/Layout';
import { apiBaseUrl } from '../config.json';

const LAUNCH = 'LAUNCH'
const REQUEST_ACCESS = 'REQUEST ACCESS';

const Services = props => (
  <Layout>
    <h2>My Services</h2>
    <MyServices {...props} action={LAUNCH} />
    <h2>Available</h2>
    <AvailableServices {...props} action={REQUEST_ACCESS} />
    <h2>Powered by CyVerse</h2>
    <PoweredServices {...props} action={LAUNCH} />
  </Layout>
);

function MyServices(props) {
  const services = props.user.services;

  if (services.length > 0) {
    return <ServiceGrid services={services} action={props.action} />;
  }

  return (
    <p>
    Looks like you don't have access to any services.
    If you request access to one, you'll find it here.
    </p>
  )
}

function AvailableServices(props) {
  const services = props.services
    .filter(service => service.approval_key != '')
    .filter(service => !props.user.services.map(service => service.id).includes(service.id));

  if (services.length > 0) {
    return <ServiceGrid services={services} action={props.action} />;
  }

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

function PoweredServices(props) {
  const services = props.services
    .filter(service => service.powered_services.length > 0);

  if (services.length > 0) {
    return <ServiceGrid services={services} action={props.action} />;
  }

  return (
    <p>
    There are no additional services available.
    </p>
  )
}

function ServiceGrid(props) {
  const services = props.services;

  return (
    <Grid container spacing={4}>
      {services.map(service =>
        <Service key={service.id} service={service} action={props.action} />
      )}
    </Grid>
  );
}

function Service(props) {
  const service = props.service;

  return (
    <Grid item xs={4}>
      <Card>
        <Paper> {/*className={fixedHeightPaper}>*/}
          <div>{service.name}</div>
          <br />
          <div>{service.description}</div>
          <br />
          <a href={service.service_url} target="_blank">{props.action}</a>
        </Paper>
      </Card>
    </Grid>
  )
}

export async function getServerSideProps() {
  let res = await fetch(apiBaseUrl + `/users/mine`);
  const user = await res.json();

  res = await fetch(apiBaseUrl + `/services`);
  const services = await res.json();

  return { 
    props: { 
      user: user,
      services: services
    } 
  };
};

export default Services;