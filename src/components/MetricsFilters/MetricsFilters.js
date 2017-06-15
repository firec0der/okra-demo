// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from utils
import { mergeObjects } from '../../utils/object';

export default class MetricsFilters extends React.Component {

  static propTypes = {
    metrics: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })).isRequired
    }).isRequired),
    onChange: PropTypes.func,
    selectedValue: PropTypes.string
  };

  static defaultProps = {
    metrics: [],
    onChange: value => {},
    selectedValue: null
  }

  constructor(props, ...args) {
    super(props, ...args);

    const selectedGroup = _.find(
      group => group.items.some(item => item.value === props.selectedValue),
      props.metrics
    );

    this.state = {
      selectedGroupId: _.getOr(null, 'id', selectedGroup)
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const propsToPick = ['metrics', 'selectedValue'];

    return !_.isEqual(_.pick(propsToPick, this.props), _.pick(propsToPick, nextProps))
      || !_.isEqual(this.state.selectedGroupId, nextState.selectedGroupId);
  };

  onGroupSelect = selectedGroupId => {
    const { metrics, onChange } = this.props;

    const firstItem = _.getOr(
      null,
      'items[0]',
      _.find(group => group.id === selectedGroupId, metrics)
    );

    this.setState({ selectedGroupId }, onChange(firstItem ? firstItem.value : null));
  }

  renderGroups = () => {
    const { metrics } = this.props;
    const { selectedGroupId } = this.state;

    const buttons = metrics.map(group => {
      const baseProps = {
        bsSize: 'xsmall',
        key: group.id,
        onClick: this.onGroupSelect.bind(null, group.id)
      };

      const props = mergeObjects(
        baseProps,
        selectedGroupId === group.id ? { bsStyle: 'primary' } : {}
      );

      return <Button {...props}>{ group.name }</Button>;
    });

    return <ButtonToolbar>{ buttons }</ButtonToolbar>;
  }

  renderButtons = () => {
    const { metrics, selectedValue, onChange } = this.props;
    const { selectedGroupId } = this.state;

    const items = _.getOr(
      [],
      'items',
      _.find(group => group.id === selectedGroupId, metrics)
    );

    const buttons = items.map(metric => {
      const baseProps = {
        bsSize: 'xsmall',
        key: metric.value,
        onClick: onChange.bind(null, metric.value)
      };

      const props = mergeObjects(
        baseProps,
        selectedValue === metric.value ? { bsStyle: 'primary' } : {}
      );

      return <Button {...props}>{ metric.label }</Button>;
    });

    return <ButtonToolbar>{ buttons }</ButtonToolbar>;
  }

  render() {
    return (
      <div>
        { this.renderGroups() }
        { this.renderButtons() }
      </div>
    )
  }

}
