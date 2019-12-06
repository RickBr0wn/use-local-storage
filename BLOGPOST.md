
# Building a useLocalState hook for React

In this post, we will be creating a useLocalState() custom hook in React. In future posts, we will write tests for this hook using react-testing-library and publish it on NPM. But first, why a local storage hook? Well, just recently I have been working on re-usable hooks and recently I always seem to use local storage in apps that I write whilst learning React. So let's combine the two, write a blog post and see what we learn.

For this we will use 'create-react-app' by typing:

		npx create-react-app use-local-storage

So initially I like to start by designing the API that I wish to use from my hook, and then the implementation after. So let us open our new app, in our preferred code editor & find the `App.js` file located in the `/src` folder.

		cd use-local-storage && code .

Remove the contents of `App.js` and replace them with the following code, and then we'll go through it.

	import React from 'react'

	const App = () => {
	  return (
	    <div>
	    <h2>Local Storage custom React hook</h2>
	    <input
	      type="text"
	      placeholder="Enter your name"
	      value={storage}
	      onChange={e => setStorage(e.target.value)}
	    />
	    <button onClick={() => setStorage('updated')}>Click</button>
	  </div>
	  )
	}

	export default App

Ok, so our app is rubbish, all it consists of is an input field and a button. But it should be enough to demonstrate our custom hook, and we'll be able to go on and use our hook in many different apps. But now for, let us carry on. Every time you type a letter into the input field we want the app to save the contents of the input field into local storage. When the button is clicked, we want to override the value in local storage, with an arbitrary value (in this case 'updated'). Like I said this is a pointless app, but it is here so we can see our custom hook working locally.

Obviously, if we try to run this both `storage` and `setStorage` are `undefined`, so let's fix that:

	const App = () => {
	  const [storage, setStorage] = useLocalStorage('name', 'Rick')
	  return (
		// ... The rest of App.js

This line is our custom hook API. We want to exactly replicate the `React.useState` API and receive an array from our custom hook, which we can de-structure to get `storage` (the value currently held in local storage) and `setStorage` (a function which when passed an argument assigns it to `storage`). Additionally, we can pass 2 arguments to our custom hook, both of which must be strings and will form the `key/value` pair stored in local storage.

Once again we see an error: `useLocalStorage is undefined`, so let's define it, together with `storedValue` and `setValueInLocalStorage` and then return them in an array, as per our example API.

	import React from 'react'

	function useLocalState(key, value) {
	  const storedValue = null
	  const setValueInLocalStorage = () => {}
	    return [storedValue,setValueInLocalStorage]
	  }

	  const App = () => {
	    const [storage, setStorage] = useLocalStorage('name', 'Default_Name')
	    // ... The rest of App.js

Now we will use the `React.useState` hook to manage our `storedValue` lke this:

	function useLocalState(key, value) {
	  const [storedValue, setStoredValue] = React.useState()
	  const setValueInLocalStorage = () => {}
	  // ... The rest of useLocalState function

The biggest take away I learned from this process, is that useState can take a `function` as an argument, so we can computationally provide a default value. I have used `try/catch` blocks in this custom hook, to handle any errors, and in case of the error throw warning, so the hook does not just stop and return the initial value.

	const [storedValue, setStoredValue] = React.useState(() => {
	  try {
	    const item = window.localStorage.getItem(key)
	    return item ? JSON.parse(item) : initialValue
	  } catch (error) {
	    console.warn('There was an error whilst retrieving the value from local state. This has only thrown a `warning`, so this hook will continue to work.\nError: ', error)
	    return initialValue
	  }
	})

	const setValueInLocalStorage = () => {}

	// ... The rest of useLocalState function

So let us discuss the `try` block. I used the `window.localStorage.getItem()` function to retrieve any existing local storage values (it might not be the first time a consumer has used this hook).

Using a `ternary operator` we will then check `item`. If it is `true` (there IS a value currently in local storage), will we use the `JSON.parse()` method to parse the value, and use it as the initial value. If `item` is false, we will just use the initial value.

So before we implement the `setValueInLocalStorage` function, let us discuss the `React.useState` API again. Consider this basic `Counter` component:

	import React from 'react'

	export default function Counter() {
	  const [count, setCount] = React.useState(0)
	  return (
	    <>
	      <h3>Count: {count}</h3>
	      <button onClick={setCount(prev => prev + 1)}>INCREMENT</button>
	      <button onClick={setCount(0)}>RESET</button>
	    </>
	  )
	}

When the `setCount` function is called inside of the onClick method of the `RESET` button, a hardcoded `0` is entered to reset the counter back to zero. But in the `INCREMENT` button onClick method a function is passed that takes the previous value of `count` as its argument and increments it by one. This `pattern` is called the `update pattern` and is the correct way to increment/decrement in the `React.useState` hook.

So now, let's fix the `setValueInLocalStorage` function and allow it to accept a function and adopt the `update-pattern`, and then we can discuss the `try` block again. I'm going to leave the `catch` block error handling `dumb` and come back to that on another blog post.

	const setValueInLocalStorage = value => {
	  try {
	    const updatedArgValue =
		  value instanceof Function ? value(storedValue) : value
		setStoredValue(updatedArgValue)
		window.localStorage.setItem(key, JSON.stringify(updatedArgValue))
	  } catch (err) {
		// TODO: A better error handling implementation is needed.
		console.warn(err)
	  }
	}

Lets go through this line by line:

	const updatedArgValue =
value instanceof Function ? value(storedValue) : value

This is where we implement the `update-pattern`. We use another `ternary operator` to check to see if our argument `value` is a `function`, by using the `instanceof` keyword. This will check the `value` prototype-chain to see if it contains the `Function` prototype object. If true (`value` IS a `function`) we will call the `value` function using our `storedValue` as its argument, and return the value. If false (`value` is NOT a `function`) then we will just return the value.

	setStoredValue(updatedArgValue)

We can then pass `updatedArgValue` from the previous line to our custom hooks `React.useState` hook, that we created. This will set the value of `storedValue`.

	window.localStorage.setItem(key, JSON.stringify(updatedArgValue))


Because `window.localStorage` accepts an object, consisting of a `key/value` pair, We can then save `updatedArgValue` to local storage using the `key` argument, and a `JSON.stringify()` on the `updatedArgValue`.

And that's it. Congratulations! You have just created a custom React hook, which can be extracted and packaged, and then re-used many, many times. Which is essentially React hooks in a nut-shell. Here is the complete code.

	import React from 'react'

	export function useLocalStorage(key, initialValue) {
	  const [storedValue, setStoredValue] = React.useState(() => {
	    try {
		  // Return the value currently in local storage or initial state.
		  const item = window.localStorage.getItem(key)
		  return item ? JSON.parse(item) : initialValue
		} catch (err) {
		  console.warn('There was an error whilst retrieving the value from local state. This has only thrown a `warning`, so this hook will continue to work.\nError: ', err)
	      return initialValue
	    }
	  })

	  const setValueInLocalStorage = value => {
	    try {
	      const updatedArgValue =
	      value instanceof Function ? value(storedValue) : value
		  setStoredValue(updatedArgValue)
		  window.localStorage.setItem(key, JSON.stringify(updatedArgValue))
	    } catch (err) {
		  // TODO: A better error handling implementation is needed.
		  console.log(err)
	    }
	  }
	  return [storedValue, setValueInLocalStorage]
	}

	const App = () => {
	  return (
	    <div>
	      <h2>Local Storage custom React hook</h2>
	      <input
	        type="text"
	        placeholder="Enter your name"
	        value={storage}
			onChange={e => setStorage(e.target.value)}
		  />
		  <button onClick={() => setStorage('updated')}>Click</button>
	    </div>
	  )
	}

	export default App

I genuinely hope that you have learned something from reading this blog post, I know I did writing it. In future posts, We will write tests for this hook using `react-testing-library` and publish it on NPM.

Thank you so much for reading, if you got to the end, I'm truly humbled 🤓