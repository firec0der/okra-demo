// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

// import from styles
import 'react-select/scss/default.scss';

export default class Select extends React.Component {

  static propTypes = {
    onChange: PropTypes.func
  };

  static defaultProps = {
    onChange: (value) => {}
  };

  constructor(...args) {
    super(...args);

    this.state = {
      value: []
    };
  }

  handleChange = (value) => this.setState({ value }, this.props.onChange.bind(null, value));

  render() {
    const { value } = this.state;

    return (
      <ReactSelect
        {...this.props}
        onChange={this.handleChange}
        value={value}
      />
    );
  }

}
