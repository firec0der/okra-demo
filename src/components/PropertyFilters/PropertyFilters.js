// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from utils
import { mergeObjects } from '../../utils/object';

export default class PropertyFilters extends React.Component {

  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired),
    onChange: PropTypes.func,
    selected: PropTypes.string
  };

  shouldComponentUpdate = (nextProps) => !_.isEqual(
    _.pick(['filters', 'selected'], this.props),
    _.pick(['filters', 'selected'], nextProps)
  );

  renderButtons = () => {
    const { filters, selected, onChange } = this.props;

    return filters.map(filter => {
      const baseProps = {
        bsSize: 'xsmall',
        onClick: onChange.bind(null, filter.value),
        key: `${filter.value} ${filter.label}`
      };

      const props = mergeObjects(
        baseProps,
        selected === filter.value ? { bsStyle: 'primary' } : {}
      );

      return <Button {...props}>{ filter.label }</Button>;
    });
  }

  render() {
    return (
      <ButtonToolbar>
        { this.renderButtons() }
      </ButtonToolbar>
    );
  }

}
