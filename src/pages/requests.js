import fetch from 'isomorphic-unfetch'
import { Link, Grid } from '@material-ui/core'
import { Layout, SummaryCard } from '../components'
import { apiBaseUrl } from '../config.json'

const Requests = props => (
  <Layout {...props}>
    <h1>Requests</h1>
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
)

function RequestGrid(props) {
  const forms = props.forms

  return (
    <Grid container spacing={3}>
      {forms.map(form =>
        <Grid item xs={6} key={form.id}>
          <Request form={form} />
        </Grid>
      )}
    </Grid>
  )
}

function Request(props) {
  const form = props.form

  return (
    <Link underline='none' href={`requests/${form.id}`}>
      <SummaryCard 
      title={form.name} 
      description={form.description} 
      />
    </Link>
  )
}

export async function getServerSideProps() {
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/requests`)
  const requests = await res.json()

  return { 
    props: { 
      user,
      requests
    } 
  }
}

export default Requests