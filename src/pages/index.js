import fetch from 'isomorphic-unfetch';
import Dashboard from '../components/Dashboard';
import { apiBaseUrl } from '../config.json';

const Index = props => (
  <div>
    <Dashboard {...props}/>
  </div>
);

export async function getServerSideProps() {
  let res = await fetch(apiBaseUrl + `/users/mine`);
  const user = await res.json();

  res = await fetch(apiBaseUrl + `/services`);
  const services = await res.json();

  res = await fetch(apiBaseUrl + `/workshops`);
  const workshops = await res.json();

  res = await fetch(apiBaseUrl + `/requests`);
  const requests = await res.json();

  return { 
    props: { 
      user: user,
      services: services,
      workshops: workshops,
      requests: requests
    } 
  };
};

export default Index;