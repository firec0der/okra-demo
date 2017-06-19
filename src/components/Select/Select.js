// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from styles
import 'react-select/scss/default.scss';

export default class Select extends React.Component {

  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    // TODO: null || { value: 'value', label: 'label' }
    options: PropTypes.any,
    // TODO null || { value: 'value', label: 'label' } || [{ value: 'value', label: 'label' }, ...]
    value: PropTypes.any,
    multi: PropTypes.bool,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    onChange: (value) => {},
    multi: false,
    isLoading: false,
    options: [],
    value: null
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
    const { label, value, options, multi, isLoading } = this.props;

    return (
      <FormGroup>
        { label && <ControlLabel>{ label }</ControlLabel> }
        <ReactSelect
          options={options}
          onChange={this.handleChange}
          value={value}
          multi={multi}
          isLoading={isLoading}
        />
      </FormGroup>
    );
  }

}
