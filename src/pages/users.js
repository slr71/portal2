import Layout from '../components/Layout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

const Index = props => (
  <Layout>
    <h1>Users</h1>
    <ul>
      {props.users.map(user => (
        <li key={user.id}>
          <Link href="/users/[id]" as={`/users/${user.id}`}>
            <a>{user.username}</a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
);

Index.getInitialProps = async function() {
  const res = await fetch('http://localhost:3022/users');
  const data = await res.json();

  console.log(`Users fetched. Count: ${data.length}`);
  console.log(data);

  return {
    users: data
  };
};

export default Index;