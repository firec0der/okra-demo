// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from components
import DataFilter from '../../components/DataFilter/DataFilter';

// import from utils
import { mergeObjects } from '../../utils/object';

// import from constants
import { NIELSEN_DATA_FILTERS } from '../../constants/nielsenDataFilters';
import DATA_FILTERS_PROP_TYPES from './dataFiltersPropTypes';

export default class DataFilters extends React.Component {

  static propTypes = mergeObjects(DATA_FILTERS_PROP_TYPES, {
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
  });

  static propTypes = {
    onChange: values => {}
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = { values: this.initialValues() };
    this.onChangeCallbacks = this.initCallbacks();
  }

  onChangeSingle = (property, value) => {
    const values = mergeObjects(this.state.values, {
      [property]: value ? parseInt(value.value) : null
    });

    this.setState({ values });
  };

  onChangeMultiple = (propery, arrayWithValues) => {
    const values = mergeObjects(this.state.values, {
      [propery]: arrayWithValues.map(value => parseInt(value.value))
    });

    this.setState({ values });
  };

  getDictionary = propKey => _.getOr({}, `${propKey}.dictionary`, this.props);
  getIsLoading = propKey => _.getOr(false, `${propKey}.isLoading`, this.props);

  initialValues = () => _.flow([
    _.filter(filter => Object.keys(NIELSEN_DATA_FILTERS).includes(filter)),
    _.reduce((acc, filter) => mergeObjects(acc, {
      [NIELSEN_DATA_FILTERS[filter].stateKey]: NIELSEN_DATA_FILTERS[filter].multi ? [] : null
    }), {})
  ])(this.props.dataFilters);

  initCallbacks = () => _.flow([
    _.filter(filter => Object.keys(NIELSEN_DATA_FILTERS).includes(filter)),
    _.reduce((acc, filter) => mergeObjects(acc, {
      [filter]: NIELSEN_DATA_FILTERS[filter].multi
        ? this.onChangeMultiple.bind(null, NIELSEN_DATA_FILTERS[filter].stateKey)
        : this.onChangeSingle.bind(null, NIELSEN_DATA_FILTERS[filter].stateKey)
    }), {})
  ])(this.props.dataFilters);

  renderFilters = () => _.flow([
    _.filter(filter => Object.keys(NIELSEN_DATA_FILTERS).includes(filter)),
    _.map(filter => (
      <DataFilter
        key={filter}
        label={NIELSEN_DATA_FILTERS[filter].label}
        multi={NIELSEN_DATA_FILTERS[filter].multi}
        dictionary={this.getDictionary(NIELSEN_DATA_FILTERS[filter].propKey)}
        isLoading={this.getIsLoading(NIELSEN_DATA_FILTERS[filter].propKey)}
        onChange={this.onChangeCallbacks[filter]}
      />
    )),
    _.chunk(4),
    _.map((row, index) => (
      <Grid key={index}>
        { row.map((item, index) => (
          <Col key={index} xs={12} md={3}>
            { item }
          </Col>
        )) }
      </Grid>
    ))
  ])(this.props.dataFilters);

  render() {
    return (
      <div>{ this.renderFilters() }</div>
    )
  }

}