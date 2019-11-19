import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    // Send a request to the server for authentication then call props.onLoggedIn(username)
    props.onLoggedIn(username);
  };

  const openRegistrationView = (e) => {
    props.openRegistrationView();
  }

  return (
    <Form>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" onChange={e => setUsername(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" onChange={e => setPassword(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
      <br />
      <br />
      <Button variant="primary" type="submit" onClick={openRegistrationView}>
        Create new account
      </Button>
    </Form>
  );
}