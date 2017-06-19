// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from components
import DataFilter from '../DataFilter/DataFilter';

// import from utils
import { mergeObjects } from '../../utils/object';

export default class DataFilters extends React.Component {

  static propTypes = {
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    dataFiltersConfig: PropTypes.object,
    values: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultTypes = {
    onChange: values => {},
    dataFilters: {},
    dataFilters: {}
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
    const { dataFiltersConfig } = this.props;

    // it's impossible, but anyway, something bad could happen.
    if (!dataFiltersConfig[filter]) { return null; }

    const { propKey, key, multi } = dataFiltersConfig[filter];
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
    const { dataFiltersConfig, values } = this.props;

    const getValue = filter => values && values[dataFiltersConfig[filter].key]
      ? values[dataFiltersConfig[filter].key]
      : dataFiltersConfig[filter].multi ? [] : null;

    return Object.keys(dataFiltersConfig).reduce(
      (acc, filterName) => mergeObjects(acc, {
        [dataFiltersConfig[filterName].key]: getValue(filterName)
      }),
      {}
    );
  };

  initCallbacks = () => {
    const { dataFiltersConfig, dataFilters } = this.props;

    return _.flow([
      _.filter(filter => Object.keys(dataFiltersConfig).includes(filter)),
      _.reduce((acc, filter) => mergeObjects(acc, {
        [filter]: dataFiltersConfig[filter].multi
          ? this.onChangeMultiple.bind(null, dataFiltersConfig[filter].key)
          : this.onChangeSingle.bind(null, dataFiltersConfig[filter].key)
      }), {})
    ])(dataFilters);
  }

  renderFilters = () => {
    const { dataFiltersConfig, dataFilters } = this.props;

    return _.flow([
      _.filter(filter => Object.keys(dataFiltersConfig).includes(filter)),
      _.map(filter => (
        <DataFilter
          key={filter}
          value={this.getSelectedValue(filter)}
          label={dataFiltersConfig[filter].label}
          multi={dataFiltersConfig[filter].multi}
          dictionary={this.getDictionary(dataFiltersConfig[filter].propKey)}
          isLoading={this.getIsLoading(dataFiltersConfig[filter].propKey)}
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
    ])(dataFilters);
  }

  render() {
    return (
      <div>{ this.renderFilters() }</div>
    )
  }

}
