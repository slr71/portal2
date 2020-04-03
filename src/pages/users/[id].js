import { useRouter } from 'next/router'
import Layout from '../../components/Layout.js'

export default function User() {
  const router = useRouter()

  return (
    <Layout>
      <h1>{router.query.id}</h1>
      <p>This is the user content.</p>
    </Layout>
  )
}