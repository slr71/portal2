import React from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'

// Drop-in replacement for formik-material-ui's CheckboxWithLabel. Used as the
// `component` of a Formik <Field>, which supplies `field`/`form` as props and
// consumes `name` itself, and passes the label as `Label={{ label, ...rest }}`.
const FormikCheckboxWithLabel = ({
    field,
    form,
    Label = {},
    defaultValue,
    ...props
}) => {
    const { label, ...labelProps } = Label
    return (
        <FormControlLabel
            control={<Checkbox {...props} {...field} checked={!!field.value} />}
            label={label}
            {...labelProps}
        />
    )
}

export default FormikCheckboxWithLabel
