/*
 * Miscellaneous common routines
 */

import { isAscii } from 'validator'

const validatePassword = (value) => {
  // if (value === null || value === undefined)
  //   return null
  if (String(value).length < 6)
    return 'Passwords must be at least 6 characters long'
  if (String(value).indexOf(' ') >= 0)
    return 'Passwords may not contain spaces'
  if (!isAscii(value))
    return 'Passwords may not contain special characters such as symbols or accented letters'

  return null
}

export { validatePassword }