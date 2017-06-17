// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';

// import from components
import MultipleSelect from '../Select/Select';

export default class DataFilter extends React.Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    objects: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    multi: PropTypes.bool
  }

  static defaultProps = {
    multi: false,
    isLoading: false
  };

  shouldComponentUpdate(nextProps) {
    const propsKeys = ['isLoading', 'multi', 'label', 'objects'];

    return !_.isEqual(
      _.pick(propsKeys, nextProps),
      _.pick(propsKeys, this.props)
    );
  }

  render() {
    const { label, objects, multi, isLoading, onChange } = this.props;

    const options = _.flow([
      _.entries,
      _.map(([ id, label ]) => ({ value: parseInt(id), label }))
    ])(objects);

    return (
      <MultipleSelect
        label={label}
        options={options}
        multi={multi}
        isLoading={isLoading}
        onChange={onChange}
      />
    );
  }

}
