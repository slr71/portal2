import { Button, Stepper, Step, StepLabel, FormControlLabel, TextField, MenuItem, Checkbox, Typography } from '@material-ui/core'

const FormStepper = props => {
    const activeStep = props.activeStep
    const steps = props.steps
    console.log(activeStep)
  
    return (
      <Stepper>
        {steps.map(step => (
          <Step key={step.id} completed={activeStep > step.index} active={activeStep == step.index}>
            <StepLabel>{step.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    )
  }
  
  const FormField = props => {
    if (props.type === 'boolean') {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={false}
              name={props.id}
              color="primary"
            />
          }
          label={field.name}
        />
      )
    }
  
    return ( // type is 'char', 'text', or 'select'
      <TextField 
        required={props.is_required || props.required} 
        disabled={props.disabled}
        fullWidth autoFocus={props.index == 0} 
        margin="normal" 
        id={props.id} 
        label={props.name} 
        helperText={props.description}
        defaultValue={props.value}
        select={props.options && props.options.length > 0}
        onChange={props.changeHandler}
      >
        {props.options && props.options.map(option => (
          <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
        ))}
      </TextField>
    )
  }
  
  const FormControls = props => {
    const activeStep = props.activeStep
    const numSteps = props.numSteps
  
    return (
      <div>
        {activeStep === props.numSteps ? (
          <div>
            <Typography>
              All steps completed - you&apos;re finished
            </Typography>
          </div>
        ) : (
          <div>
            <div>
              {numSteps > 1 ? (
                <Button disabled={activeStep === 0} onClick={props.backHandler}>
                  Back
                </Button> 
              ) : (
                <></>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={props.nextHandler}
              >
                {activeStep === numSteps - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  export { FormStepper, FormField, FormControls }