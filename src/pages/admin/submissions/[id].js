import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Card, CardHeader, CardContent, FormControlLabel, TextField, Checkbox } from '@material-ui/core'
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
                  // <Typography>{field.name}: {field.api_formfieldsubmission.value_text}</Typography>
                  <FormField {...field}></FormField>
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

const FormField = props => {
  if (props.api_formfieldsubmission.value_boolean != null) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={false}
            name={props.id}
            color="primary"
          />
        }
        label={props.name}
      />
    )
  }

  const key = ["value_string", "value_text", "value_number", "value_select_id", "value_email", "value_date"]
    .find(key => typeof(props.api_formfieldsubmission[key]) !== "undefined")
  const value = props.api_formfieldsubmission[key]

  return ( // type is 'char', 'text', or 'select'
    <TextField 
      disabled={true}
      fullWidth
      margin="normal" 
      id={props.id} 
      label={props.name} 
      helperText={props.description}
      defaultValue={value}
    >
    </TextField>
  )
}

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