// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from components
import DataFilter from '../DataFilter/DataFilter';

import { DATA_FILTERS_CONFIG } from '../../constants/dataFilters';

// import from utils
import { mergeObjects } from '../../utils/object';

export default class DataFilters extends React.Component {

  static propTypes = {
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    dataSetName: PropTypes.string.isRequired,
    values: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultTypes = {
    onChange: values => {},
    dataSetName: 'nielsen'
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = { values: this.initialValues() };
    this.onChangeCallbacks = this.onChangeCallbacks();
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

  onChangeMultiple = (stateKey, arrayWithValues) => {
    const values = mergeObjects(this.state.values, {
      [stateKey]: arrayWithValues.map(value => parseInt(value.value))
    });

    this.setState({ values }, () => this.props.onChange(this.state.values));
  };

  getDictionary = propKey => _.getOr({}, `${propKey}.dictionary`, this.props);
  getIsLoading = propKey => _.getOr(false, `${propKey}.isLoading`, this.props);

  getSelectedValue = filter => {
    const { dataSetName } = this.props;

    // it's impossible, but anyway, something bad could happen.
    if (!DATA_FILTERS_CONFIG[filter]) { return null; }

    const { key, multi } = DATA_FILTERS_CONFIG[filter];

    const propKey = `${dataSetName}PropKey`;
    const dictionary = this.getDictionary(
      DATA_FILTERS_CONFIG[filter][propKey]
    );

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
    const { values } = this.props;

    const getValue = filter => values && values[DATA_FILTERS_CONFIG[filter].key]
      ? values[DATA_FILTERS_CONFIG[filter].key]
      : DATA_FILTERS_CONFIG[filter].multi
        ? []
        : null;

    return Object
      .keys(DATA_FILTERS_CONFIG)
      .reduce((acc, filterName) => mergeObjects(acc, {
        [DATA_FILTERS_CONFIG[filterName].key]: getValue(filterName)
      }), {});
  };

  configForCurrentSetup = () => {
    const { dataFilters, dataSetName } = this.props;

    // Get all available filters for current data set.
    const filtersForCurrentDataSet = Object
      .keys(DATA_FILTERS_CONFIG)
      .filter(filterName => DATA_FILTERS_CONFIG[filterName][`${dataSetName}PropKey`]);

    // Assemble configs for all requested filters.
    return dataFilters
      .filter(filterName => filtersForCurrentDataSet.includes(filterName))
      .reduce((acc, filterName) => mergeObjects(acc, {
        [filterName]: DATA_FILTERS_CONFIG[filterName]
      }), {});
  }

  onChangeCallbacks = () => {
    const configForCurrentDataSet = this.configForCurrentSetup();

    return Object
      .keys(configForCurrentDataSet)
      .reduce((acc, filterName) => mergeObjects(acc, {
        [filterName]: DATA_FILTERS_CONFIG[filterName].multi
          ? this.onChangeMultiple.bind(null, configForCurrentDataSet[filterName].key)
          : this.onChangeSingle.bind(null, configForCurrentDataSet[filterName].key)
      }), {});
  }

  renderFilters = () => {
    const { dataFilters, dataSetName } = this.props;

    const configForCurrentDataSet = this.configForCurrentSetup();

    const dataFilterProps = filterName => {
      const config = configForCurrentDataSet[filterName];

      return {
        key: filterName,
        value: this.getSelectedValue(filterName),
        label: config.label,
        multi: config.multi,
        dictionary: this.getDictionary(config[`${dataSetName}PropKey`]),
        isLoading: this.getIsLoading(config[`${dataSetName}PropKey`]),
        onChange: this.onChangeCallbacks[filterName]
      };
    };

    return _.flow([
      _.keys,
      _.map(filterName => <DataFilter {...dataFilterProps(filterName)} />),
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
    ])(configForCurrentDataSet);
  }

  render() {
    return (
      <div>{ this.renderFilters() }</div>
    )
  }

}
