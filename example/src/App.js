import React from 'react'
import { useLocalStorage } from '@rickbrown/use-local-storage'

// An basis example which has an input field and a button.
// Typing into the text box will automatically save into local-storage.
// So typing your name and hitting refresh, will persist your name.
// Clicking the button will overwrite the local-storage value with 'updated'.
const App = () => {
  // Array destructuring from our custom hook.
  // It accepts 2 arguments for its initial value. ('key','value')

  const [name, setName] = useLocalStorage('name', 'Rick')

  return (
    <div>
      <h2>Local Storage custom React hook</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setName('updated')}>Click</button>
    </div>
  )
}

export default App
