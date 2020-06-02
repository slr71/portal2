import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Typography, Button, Card, CardHeader, CardContent, CardActions, Divider } from '@material-ui/core'
import { Layout, User } from '../../../components'
import { apiBaseUrl } from '../../../config.json'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  box: {
    marginBottom: '2em'
  }
}))

const FormSubmission = props => (
  <Layout {...props}>
    <Container maxWidth='lg'>
        <h1>Form Submission</h1>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <User 
              user={props.submission.user}
              institution research
            />
            <Card className={useStyles().box}>
              <CardHeader
                title="Form"
                subheader={props.submission.form.name}
              />
              <CardContent>
                {props.submission.fields.map(field =>
                  <Typography>{field.name}: {field.api_formfieldsubmission.value_text}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className={useStyles().box}>
              <CardHeader
                title="Conversations"
                subheader="TODO"
              />
            </Card>
          </Grid>
        </Grid>
    </Container>
  </Layout>
)

FormSubmission.getInitialProps = async function(context) {
  const { id } = context.query

  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/requests/submissions/${id}`)
  const submission = await res.json()

  return { user, submission }
}

export default FormSubmission