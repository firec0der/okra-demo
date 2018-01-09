import React from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class LoginModal extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = { login: '', password: '' };
  }

  render() {
    return (
      <Modal show>
        <Modal.Header closeButton>
          <Modal.Title>Please, sign in</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup controlId='login'>
            <ControlLabel>Login</ControlLabel>
            <FormControl
              type='login'
              id='login'
              placeholder='Enter login'
              onChange={event => this.setState({ login: event.target.value })}
            />
          </FormGroup>
          <FormGroup controlId='password'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type='password'
              id='password'
              placeholder='Enter password'
              onChange={event => this.setState({ password: event.target.value })}
            />
          </FormGroup>
          <Button type='submit' onClick={() => this.props.onLogin(this.state.login, this.state.password)}>
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    );
  }

}
