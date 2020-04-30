import fetch from 'isomorphic-unfetch';
import Layout from '../components/Layout';
import { apiBaseUrl } from '../config.json';

const Index = props => (
  <div>
    <Layout {...props} />
  </div>
);

// export async function getServerSideProps() {
//   let res = await fetch(apiBaseUrl + `/users/mine`);
//   const user = await res.json();

//   return { 
//     props: { 
//       user: user
//     } 
//   };
// };

export default Index;