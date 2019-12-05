import * as React from 'react'

export function useLocalStorage(key, initialValue) {
  // Setup for the storedValue that we return in our hook API
  // Implement a function to useState which will use either, the value which ...
  // ... is currently stored in local-storage. Or if there is no current ...
  // ... value then it will return the initial value. This function will only be ...
  // ... called on the first render, useState will manage it after that.
  // A try/catch block is used in this function to handle any errors.
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      // Return the value currently in local storage or initial state.
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (err) {
      // If error just return the initial value.
      console.log(err)
      return initialValue
    }
  })

  // Setup for the setValueInLocalStorage function that we return in our hook API
  const setValueInLocalStorage = value => {
    // Use a try/catch block to handle any errors.
    try {
      // Replicate the update pattern which useState uses.
      // eg: setFunction(prev => prev)
      const updatedArgValue =
        value instanceof Function ? value(storedValue) : value
      // Set our useState hook to the updated value.
      setStoredValue(updatedArgValue)
      // Save the updated value in local-storage.
      window.localStorage.setItem(key, JSON.stringify(updatedArgValue))
    } catch (err) {
      // A better error handling implementation is needed.
      console.log(err)
    }
  }
  return [storedValue, setValueInLocalStorage]
}
