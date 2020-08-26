import { useMutation } from "react-query"
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Typography } from '@material-ui/core'
import { Layout, Wizard } from '../../components'
import { useAPI } from '../../contexts/api'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Request = (props) => {
  const form = props.form
  const allFields = form.sections.reduce((acc, s) => acc.concat(s.fields), [])

  const classes = useStyles()
  const api = useAPI()

  const initialValues = 
    allFields.reduce((acc, f) => 
      { 
        acc[f.id.toString()] = ''; 
        return acc 
      }, 
      {}
    )
  console.log('initialValues:', initialValues)
  
  const [submitFormMutation] = useMutation(
    (submission) => api.submitForm(form.id, submission),
    {
        onSuccess: (resp, { onSuccess }) => {
            console.log('SUCCESS')
            // router.push(`/${NavigationConstants.ANALYSES}`);
            // onSuccess(resp);
        },
        onError: (error, { onError }) => {
          console.log('ERROR', error)
            // onError(error);
            // setSubmissionError(error);
        },
    }
  )

  const formatSubmission = (values) => {
    return allFields.map(f => {
      let val = { id: f.id }
      val['value_' + f.type] = values[f.id]
      return val
    })
  }

  return (
    <Layout>
      <Container maxWidth='md'>
        <Paper elevation={3} className={classes.paper}>
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>{form.name}</Typography>
            <Typography color="textSecondary" gutterBottom>{form.description}</Typography>
            {form.explanation !== form.description ? (
              <Typography color="textSecondary">
                <Markdown>
                  {form.explanation}
                </Markdown>
              </Typography>
            ) : (
              <></>
            )}
          </Box>
          <Wizard
            form={form}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
              console.log('Submit!!!')
              submitFormMutation(formatSubmission(values))
              setSubmitting(false)
            }}
          />
        </Paper>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ req, query }) {
  const form = await req.api.form(query.id)

  return { props: { form } }
}

export default Request