// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { FormGroup, ControlLabel } from 'react-bootstrap';

// import from styles
import 'react-select/scss/default.scss';

export default class Select extends React.Component {

  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
  };

  static defaultProps = {
    onChange: (value) => {}
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = { value: props.value || null };
  }

  handleChange = (value) => this.setState({ value }, this.props.onChange.bind(null, value));

  render() {
    const { value } = this.state;
    const { label } = this.props;

    return (
      <FormGroup>
        { label && <ControlLabel>{ label }</ControlLabel> }
        <ReactSelect
          {...this.props}
          onChange={this.handleChange}
          value={value}
        />
      </FormGroup>
    );
  }

}
