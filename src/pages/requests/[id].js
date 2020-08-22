import { useState } from 'react'
import { useRouter } from "next/router"
import { useMutation } from "react-query"
import { useAPI } from '../../contexts/api'
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, Typography, LinearProgress } from '@material-ui/core'
import { Layout, FormStepper, FormField, FormControls } from '../../components'
import { Formik, Form } from 'formik'
import { isEmail, isNumeric, isEmpty } from 'validator'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  },
  hidden: {
    display: 'none'
  }
}))

const Wizard = ({ form, initialValues, onSubmit }) => {
  const [stepNumber, setStepNumber] = useState(0)
  const [snapshot, setSnapshot] = useState(initialValues)

  const handleNext = (values) => {
    console.log('next:', values)
    setSnapshot(values)
    setStepNumber((prevStep) => prevStep + 1)
  }

  const handleBack = (values) => {
    console.log('back:', values)
    setSnapshot(values)
    setStepNumber((prevStep) => prevStep - 1)
  }

  const validate = (values) => {
    console.log('validate:', values)
    let errors = {}
    for (let field of form.sections[stepNumber].fields) {
      const id = field.id
      const value = new String(values[id])
      if (field.is_required && isEmpty(value)) 
        errors[id] = 'This field is required'
      else if (field.type == 'email' && !isEmail(value))
        errors[id] = 'A valid email address is required'
      else if (field.type == 'number' && (!isNumeric(value) || value <= 0))
        errors[id] = 'A valid numeric value is required'
      else if (field.type == 'date' && !isDate(value))
        errors[id] = 'A valid date value is required'
    }
    console.log('errors:', errors)
    return errors;
  }

  return (
    <div>
      <FormStepper activeStep={stepNumber} steps={form.sections.map(s => s.name)}/>
      <Formik
        initialValues={snapshot}
        validate={validate}
        validateOnMount
        onSubmit={onSubmit}
      >
      {({ handleChange, handleBlur, handleSubmit, isSubmitting, isValid, values, errors, touched }) => (
        <Form>
          {form.sections.map((section, index) => (
            <div key={index} className={index != stepNumber ? useStyles().hidden : ''}>
              {section.fields.map(field => (
                  <div key={field.id}>
                    <FormField
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errorText={touched[field.id] && errors[field.id]}
                      {...field}
                    />
                    <br />
                  </div>
              ))}
            </div>
          ))}
          {isSubmitting && <LinearProgress />}
          <Box display="flex" justifyContent="flex-end">
            <FormControls 
              disabled={isSubmitting || !isValid || !validate(values)}
              activeStep={stepNumber} 
              numSteps={form.sections.length} 
              nextHandler={handleNext.bind(null, values)}
              backHandler={handleBack.bind(null, values)}
              submitHandler={handleSubmit}
            />
          </Box>
        </Form>
      )}
    </Formik>
    </div>
  )
}

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