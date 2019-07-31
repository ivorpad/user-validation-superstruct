import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import {validUser, getCircularReplacer} from './helpers/validUser';
import './style.css';

function Error({errors, field}) {
  return <p>{errors[field] && errors[field]}</p>
}

const isEmptyObj = (obj) => Object.keys(obj).length === 0 ? true : false;

function App() {

  const [value, setValue] = useState({id: 0, user: ''});
  const [payload, setPayload] = useState();
  const [errors, setErrors] = useState({});

  const handleUserInput = (e) => {
    setValue({
      ...value,
      [e.target.name] : e.target.name === "id" && e.target.value ? parseInt(e.target.value, 10) : e.target.value
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log({success: payload})
  }

  useEffect(() => {
    validUser(value).then(result => {
      setPayload(result)
      setErrors({})
    }).catch(e => {

      let {errors} = e;
      errors = JSON.stringify(errors, getCircularReplacer());
      errors = JSON.parse(errors)

      const err = errors.reduce((acc, current) => {
        acc[current.type] = current.reason;
        return acc
      }, {})

      setErrors(err)
    })

  }, [value])

  const shouldDisableButton = (errors) => {
    return !isEmptyObj(errors) || !value.id || !value.user
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <p>
        <input type="number" onChange={handleUserInput} value={value.id === 0 ? "" : value.id} name="id" id="id" placeholder="user id" />
        <Error errors={errors} field="user_id" />
      </p>
      <p>
        <input type="text" autocomplete="off" onChange={handleUserInput} name="user" value={value.user} id="name" placeholder="user name" />
        <Error errors={errors} field="username" />
      </p>
      <input type="submit" disabled={shouldDisableButton(errors)} />
    </form>
  )
}
 
render(<App />, document.getElementById('root'));
