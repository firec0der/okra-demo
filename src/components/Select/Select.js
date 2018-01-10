// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from styles
import 'react-select/dist/react-select.css';

export default class Select extends React.Component {

  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    // TODO: null || { value: 'value', label: 'label' }
    options: PropTypes.any,
    // TODO null || { value: 'value', label: 'label' } || [{ value: 'value', label: 'label' }, ...]
    value: PropTypes.any,
    multi: PropTypes.bool,
    isLoading: PropTypes.bool,
    clearable: PropTypes.bool,
  };

  static defaultProps = {
    onChange: (value) => {},
    multi: false,
    isLoading: false,
    options: [],
    value: null,
    clearable: true,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const propsToCheck = ['value', 'options', 'label', 'isLoading', 'multi'];

    return !_.isEqual(
      _.pick(propsToCheck, this.props),
      _.pick(propsToCheck, nextProps)
    );
  }

  handleChange = (value) => this.setState({ value }, this.props.onChange.bind(null, value));

  render() {
    return (
      <FormGroup>
        { this.props.label && <ControlLabel>{ this.props.label }</ControlLabel> }
        <ReactSelect
          options={this.props.options}
          onChange={this.handleChange}
          value={this.props.value}
          multi={this.props.multi}
          isLoading={this.props.isLoading}
          clearable={this.props.clearable}
        />
      </FormGroup>
    );
  }

}
