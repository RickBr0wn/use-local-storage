# @rickbrown/use-local-storage

[![NPM](https://img.shields.io/npm/v/@rickbrown/use-local-storage.svg)](https://www.npmjs.com/package/@rickbrown/use-local-storage) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Description

`useLocalStorage` is a custom React hook, which simplifies using the browsers local storage, when developing React applications.

## Installation

Use the package manager [yarn](https://yarnpkg.com/en/) to install the useLocalStorage hook.

```bash
yarn add @rickbrown/use-local-storage
```

## Usage

```JSX
import { useLocalStorage } from '@rickbrown/use-local-storage'

const Example = () => {
  // Optionally accepts 2 arguments for its initial value.
  // ('key','value')
  const [name, setName] = useLocalStorage()
  
  const [newName, setNewName] = React.useState('')

  return (
    <div>
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
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
