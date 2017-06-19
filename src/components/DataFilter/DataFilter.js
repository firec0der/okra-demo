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
    value: PropTypes.any
  }

  static defaultProps = {
    onChange: () => {},
    multi: false,
    isLoading: false,
    value: null,
    dictionary: null,
  };

  shouldComponentUpdate(nextProps) {
    const propsKeys = ['value', 'dictionary', 'isLoading', 'multi', 'label'];

    return !_.isEqual(
      _.pick(propsKeys, nextProps),
      _.pick(propsKeys, this.props)
    );
  }

  render() {
    const { label, dictionary, multi, isLoading, onChange, value } = this.props;

    const options = _.flow([
      _.entries,
      _.map(([ id, label ]) => ({ value: parseInt(id), label })),
      _.sortBy('label')
    ])(dictionary);

    return (
      <Select
        label={label}
        options={options}
        multi={multi}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
      />
    );
  }

}
