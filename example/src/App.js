import React from 'react'
import { useLocalStorage } from '@rickbrown/use-local-storage'

const App = () => {
  // Accepts 2 arguments for its initial value. ('key','value')
  const [name, setName] = useLocalStorage(
    'name',
    'There is no name saved to local storage in this browser!'
  )
  const [newName, setNewName] = React.useState('')

  return (
    <div>
      <h2>useLocalStorage()</h2>
      <h3>A custom React hook.</h3>
      <p>Current value in local storage: {name}</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={newName}
        onChange={e => setNewName(e.target.value)}
      />
      <button onClick={() => setName(newName)}>
        Click To Update Local Storage
      </button>
    </div>
  )
}

export default App
