// import from vendors
import React from 'react';
import ReactSelect from 'react-select';

// import from styles
import 'react-select/scss/default.scss';

export default class Select extends React.Component {

  render() {
    return (
      <ReactSelect {...this.props} />
    );
  }

}
