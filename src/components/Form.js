import { makeStyles } from '@material-ui/core/styles'
import { Button, Stepper, Step, StepLabel, MenuItem, TextField, Typography } from '@material-ui/core'
import { Field } from 'formik'
import { CheckboxWithLabel } from "formik-material-ui"

const useStyles = makeStyles((theme) => ({
  checkbox: {
    paddingTop: '2em'
  }
}))

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
    defaultValue: '',
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
        onChange={props.onChange(props.id.toString())} // workaround for "you didn't pass an id" error
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

export { FormStepper, FormField, FormControls }