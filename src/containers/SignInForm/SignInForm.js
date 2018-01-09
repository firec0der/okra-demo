// imports from vendors
import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Alert, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import _ from 'lodash/fp';

// imports from modules
import { authenticate } from '../../modules/auth';

const mapStateToProps = ({ auth }) => ({ auth });
const mapDispatchToProps = { authenticate };

class SignInForm extends React.Component {

  static propTypes = {
    auth: propTypes.object.isRequired,
    authenticate: propTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      username: '',
      password: '',
      showError: false,
    };
  }

  onInputChange = (key, e) => this.setState({ [key]: e.target.value });
  onUsernameInputChange = this.onInputChange.bind(this, 'username');
  onPasswordInputChange = this.onInputChange.bind(this, 'password');

  onSubmit = () => {
    const { username, password } = this.state;
    const { authenticate } = this.props;

    authenticate({ username, password }).then(() => {
      if (!_.isNil(this.props.auth.error)) {
        this.setState({ showError: true });
      } else {
        this.props.router.push('/');
      }
    });
  };

  getErrorMessage = (error) => error.apiMessage
    ? error.apiMessage
    : 'Something went wrong, please, try later';

  render() {
    const { auth } = this.props;

    const shouldShowError = !_.isNil(auth.error) && this.state.showError;

    return (
      <div className="sign-in-form">
        <FormGroup controlId="username">
          { shouldShowError && (
            <Alert bsStyle="danger">
              { this.getErrorMessage(auth.error) }
            </Alert>
          ) }
          <ControlLabel>Username</ControlLabel>
          <FormControl
            type="username"
            id="username"
            placeholder="Enter username"
            onChange={this.onUsernameInputChange}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            id="password"
            placeholder="Enter password"
            onChange={this.onPasswordInputChange}
          />
        </FormGroup>
        <Button type="submit" onClick={this.onSubmit}>
          Submit
        </Button>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignInForm));
