// imports from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// imports from containers
import SignInForm from '../../containers/SignInForm/SignInForm';

export default class SignInPage extends React.Component {

  render() {
    return (
      <div className="sign-in-page">
        <Grid className="top-content" key="top-content">
          <Col xs={12} md={6} mdOffset={3}>
            <SignInForm />
          </Col>
        </Grid>
      </div>
    );
  }

}
