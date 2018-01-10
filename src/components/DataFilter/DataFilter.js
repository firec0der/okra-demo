// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';

// import from components
import Select from '../Select/Select';

export default class DataFilter extends React.Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    // TODO: null || { 1: 'value', 2: 'value' }
    dictionary: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    multi: PropTypes.bool,
    // TODO: null || { label: 'label', value: 'value' } || [{ label: 'label', value: 'value' }, ...]
    value: PropTypes.any,
    clearable: PropTypes.bool,
  }

  static defaultProps = {
    onChange: () => {},
    multi: false,
    isLoading: false,
    value: null,
    dictionary: null,
    clearable: true,
  };

  shouldComponentUpdate(nextProps) {
    const propsKeys = ['value', 'dictionary', 'isLoading', 'multi', 'label'];

    return !_.isEqual(
      _.pick(propsKeys, nextProps),
      _.pick(propsKeys, this.props)
    );
  }

  render() {
    const options = _.flow([
      _.entries,
      _.map(([id, label]) => ({ value: parseInt(id), label })),
      _.sortBy('label'),
    ])(this.props.dictionary);

    return (
      <Select
        label={this.props.label}
        options={options}
        multi={this.props.multi}
        isLoading={this.props.isLoading}
        onChange={this.props.onChange}
        value={this.props.value}
        clearable={this.props.clearable}
      />
    );
  }

}
