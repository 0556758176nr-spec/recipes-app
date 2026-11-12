import React from 'react'
import { useNavigate } from 'react-router';
import { login } from '../services/auth';

export default function LoginUncontrolled() {
  const navigate1 = useNavigate();

  const save = (data) => {
    console.log(data);

    const obj = {
      email: data.get('email'),
      password: data.get('password'),
    };

    const user = login(obj);

    if (user) {
      navigate1('/recipes');
    }

    console.log(obj);
  };

  return (
    <div>
      <form action={save} style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="email">Email defaultValue="chef@recipes.com"</label>
        <input type="email" name="email" id="email" defaultValue="chef@recipes.com" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button>OK</button>
      </form>
    </div>
  )
}