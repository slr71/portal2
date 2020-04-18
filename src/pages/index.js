import fetch from 'isomorphic-unfetch';
import Dashboard from '../components/Dashboard';
import { apiBaseUrl } from '../config.json';

const Index = props => (
  <div>
    <Dashboard user={props.user} services={props.services}/>
  </div>
);

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

export default Index;