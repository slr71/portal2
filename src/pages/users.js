import Layout from '../components/Layout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import { apiBaseUrl } from '../config';

const Users = props => (
  <Layout>
    <h1>Users</h1>
    <div>
      <input type="search" placeholder="Search for ..." />
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Institution</th>
            <th>Occupation</th>
            <th>Region</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map(user => (
            <tr key={user.id}>
              <td>
                {user.first_name}
              </td>
              <td>
                {user.last_name}
              </td>
              <td>
                <Link href="/users/[id]" as={`/users/${user.id}`}>
                  <a>{user.username}</a>
                </Link>
              </td>
              <td>
                {user.institution}
              </td>
              <td>
                {user.occupation.name}
              </td>
              <td>
                {user.region.name}
              </td>
              <td>
                {user.region.country.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Layout>
);

Users.getInitialProps = async context => {
  const req = context.req;
  const token = ( req && req.kauth && req.kauth.grant && req.kauth.grant.access_token ? req.kauth.grant.access_token.token : null );

  const res = await fetch(apiBaseUrl + '/users', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` } //FIXME add middleware to do this like Sonora
  });

  const data = await res.json();

  console.log(`Users fetched. Count: ${data.length}`);

  return {
    users: data,
    keyword: ""
  };
};

export default Users;