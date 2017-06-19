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
    values: PropTypes.object,
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

  componentDidMount() {
    this.props.onChange(this.state.values);
  }

  onChangeSingle = (property, value) => {
    const values = mergeObjects(this.state.values, {
      [property]: value ? parseInt(value.value) : null
    });

    this.setState({ values }, () => this.props.onChange(this.state.values));
  };

  onChangeMultiple = (propery, arrayWithValues) => {
    const values = mergeObjects(this.state.values, {
      [propery]: arrayWithValues.map(value => parseInt(value.value))
    });

    this.setState({ values }, () => this.props.onChange(this.state.values));
  };

  getDictionary = propKey => _.getOr({}, `${propKey}.dictionary`, this.props);
  getIsLoading = propKey => _.getOr(false, `${propKey}.isLoading`, this.props);

  getSelectedValue = filter => {
    // it's impossible, but anyway, something bad could happen.
    if (!NIELSEN_DATA_FILTERS[filter]) { return null; }

    const { propKey, key, multi, label } = NIELSEN_DATA_FILTERS[filter];
    const dictionary = this.getDictionary(propKey);

    if (_.isEmpty(dictionary) || !this.state.values[key]) { return null; }

    if (!multi) {
      return {
        label: dictionary[this.state.values[key]],
        value: this.state.values[key]
      };
    }

    return this.state.values[key].map(id => ({ label: dictionary[id], value: id }));
  };

  initialValues = () => {
    const { dataFilters, values } = this.props;

    const filterNames = Object.keys(NIELSEN_DATA_FILTERS);

    const getValue = filter => values && values[NIELSEN_DATA_FILTERS[filter].key]
      ? values[NIELSEN_DATA_FILTERS[filter].key]
      : NIELSEN_DATA_FILTERS[filter].multi ? [] : null

    return Object.keys(NIELSEN_DATA_FILTERS).reduce(
      (acc, filterName) => mergeObjects(acc, {
        [NIELSEN_DATA_FILTERS[filterName].key]: getValue(filterName)
      }),
      {}
    );
  };

  initCallbacks = () => _.flow([
    _.filter(filter => Object.keys(NIELSEN_DATA_FILTERS).includes(filter)),
    _.reduce((acc, filter) => mergeObjects(acc, {
      [filter]: NIELSEN_DATA_FILTERS[filter].multi
        ? this.onChangeMultiple.bind(null, NIELSEN_DATA_FILTERS[filter].key)
        : this.onChangeSingle.bind(null, NIELSEN_DATA_FILTERS[filter].key)
    }), {})
  ])(this.props.dataFilters);

  renderFilters = () => _.flow([
    _.filter(filter => Object.keys(NIELSEN_DATA_FILTERS).includes(filter)),
    _.map(filter => (
      <DataFilter
        key={filter}
        value={this.getSelectedValue(filter)}
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
