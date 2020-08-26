import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, Stepper, Step, StepLabel, MenuItem, TextField, Typography, LinearProgress } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { isEmail, isNumeric, isEmpty } from 'validator'
import { CheckboxWithLabel } from "formik-material-ui"

const useStyles = makeStyles((theme) => ({
  checkbox: {
    paddingTop: '2em'
  },
  hidden: {
    display: 'none'
  }
}))

const validateField = (field, value) => {
  if (field.is_required && isEmpty(value)) 
    return 'This field is required'
  else if (field.type == 'email' && !isEmail(value))
    return 'A valid email address is required'
  else if (field.type == 'number' && (!isNumeric(value) || value <= 0))
    return 'A valid numeric value is required'
  else if (field.type == 'date' && !isDate(value))
    return 'A valid date value is required'
}

const UpdateForm = ({ form, initialValues, onSubmit }) => {
  const validate = (values) => {
    console.log('validate:', values)
    let errors = {}
    for (let field of form.fields) {
      const id = field.id
      const value = new String(values[id])
      const error = validateField(field, value)
      if (error)
        errors[id] = error
    }
    console.log('errors:', errors)
    return errors;
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, isSubmitting, isValid, values, errors, touched }) => (
        <Form>
          {form.fields && form.fields.map(field => (
              <div key={field.id}>
                <FormField
                  component={TextField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorText={touched[field.id] && errors[field.id]}
                  {...field}
                />
                <br />
              </div>
          ))}
          {isSubmitting && <LinearProgress />}
          <br />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting || !isValid}
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

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
      const error = validateField(field, value)
      if (error)
        errors[id] = error
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

const FormStepper = ({activeStep, steps}) => {
  if (steps.length <= 1)
    return (<></>)

  return (
    <Stepper>
      {steps.map((title, index) => (
        <Step key={title} completed={activeStep > index} active={activeStep == index}>
          <StepLabel>{title}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

const FormField = props => {
  const commonProps = {
    id: props.id.toString(),
    name: props.id.toString(),
    label: props.name,
    error: props.errorText != null,
    helperText: props.errorText || props.description,
    defaultValue: props.value,
    type: props.type,
    fullWidth: true, 
    margin: "normal",
    required: props.is_required || props.required,
    disabled: props.disabled
  }

  if (props.type === 'boolean') {
    return (
      <Field
        type="checkbox"
        component={CheckboxWithLabel}
        name={props.id.toString()}
        color="primary"
        onChange={props.onChange}
        Label={{label: props.name, className: useStyles().checkbox}}
      />
    )
  }

  if (props.type === 'select') {
    return (
      <Field
        as="select"
        component={TextField}
        select
        onChange={props.onChange && props.onChange(props.id.toString())} // workaround for "you didn't pass an id" error
        {...commonProps}
      >
        {props.options.map(option => (
          <MenuItem key={option.id} value={option.id.toString()}>{option.name}</MenuItem>
        ))}
      </Field>
    )
  }
  
  return ( // type is 'char' or 'text'
    <Field
      component={TextField}
      autoFocus={props.index == 0} 
      onChange={props.onChange}
      onBlur={props.onBlur}
      {...commonProps}
    />
  )
}
  
const FormControls = ({ disabled, activeStep, numSteps, backHandler, nextHandler, submitHandler }) => {
  const isLastStep = activeStep === numSteps - 1

  return (
    <div>
      {activeStep === numSteps ? (
        <div>
          <Typography>
            All steps completed - you&apos;re finished
          </Typography>
        </div>
      ) : (
        <div>
          {numSteps > 1 && (
            <Button disabled={activeStep === 0} onClick={backHandler}>
              Back
            </Button> 
          )}
          <Button
            disabled={disabled}
            variant="contained"
            color="primary"
            onClick={isLastStep ? submitHandler : nextHandler}
          >
            {isLastStep ? 'Submit' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  )
}

export { UpdateForm, Wizard, FormStepper, FormField, FormControls }