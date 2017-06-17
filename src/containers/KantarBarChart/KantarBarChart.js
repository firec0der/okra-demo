// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from components
import SearchBar from '../../components/SearchBar/SearchBar';
import StackedBarChart from '../../components/StackedBarChart/StackedBarChart';
import PieChart from '../../components/PieChart/PieChart';
import MultipleSelect from '../../components/Select/Select';
import MetricsFilters from '../../components/MetricsFilters/MetricsFilters';
import DataFilter from '../../components/DataFilter/DataFilter';

// import from utils
import { mergeObjects } from '../../utils/object';

// import from modules
import { fetchKantarData, clearKantarData } from '../../modules/kantar/kantarData';

const mapStateToProps = state => ({
  metrics: state.metrics,
  kantarBrands: state.kantarBrands,
  kantarData: state.kantarData,
  kantarAreas: state.kantarAreas,
  kantarGenres: state.kantarGenres,
  kantarPackagings: state.kantarPackagings,
});

const mapDispatchToProps = {
  fetchKantarData,
  clearKantarData
};

class KantarBarChart extends React.Component {

  static propTypes = {
    kantarBrands: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      table: PropTypes.object,
    }),
    kantarAreas: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      table: PropTypes.object,
    }),
    kantarData: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      list: PropTypes.array,
    }),
    metrics: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      list: PropTypes.array.isRequired
    }),
    kantarPackagings: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      applicableForBrands: PropTypes.arrayOf(PropTypes.number).isRequired,
      dictionary: PropTypes.object.isRequired,
    }),
    kantarGenres: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      applicableForBrands: PropTypes.arrayOf(PropTypes.number).isRequired,
      dictionary: PropTypes.object.isRequired,
    }),
    fetchKantarData: PropTypes.func.isRequired,
    clearKantarData: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      dataFilters: {
        brandIds: [],
        metric: 'penetration',
        areaIds: [],
        packagingId: null
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsKeys = [
      'kantarBrands',
      'kantarAreas',
      'kantarData',
      'kantarPackagings',
      'kantarGenres',
      'metrics'
    ];

    return !_.isEqual(_.pick(propsKeys, nextProps), _.pick(propsKeys, this.props))
      || !_.isEqual(this.state.dataFilters, nextState.dataFilters)
  }

  fetchData = dataFilters => {
    const { brandIds, areaIds, packagingId, genreId } = dataFilters;
    const { fetchKantarData } = this.props;

    if (brandIds.length && areaIds.length) {
      fetchKantarData({ brandIds, areaIds, packagingId, genreId });
    }
  };

  onBrandSelectChange = selectedBrands => {
    const brandIds = selectedBrands.map(value => parseInt(value.value));

    const dataFilters = mergeObjects(
      this.state.dataFilters,
      { brandIds },
      !this.shouldUsePackagingsFilter(brandIds) ? { packagingId: null } : {},
      !this.shouldUseGenreFilter(brandIds) ? { genreId: null } : {}
    );

    this.setState({ dataFilters }, dataFilters.brandIds.length
      ? () => this.fetchData(dataFilters)
      : this.props.clearKantarData
    );
  }

  onPackagingsSelectChange = selectedPackaging => {
    const packagingId = selectedPackaging
      ? parseInt(selectedPackaging.value)
      : null;
    const dataFilters = mergeObjects(this.state.dataFilters, { packagingId });

    this.setState({ dataFilters }, dataFilters.brandIds.length
      ? () => this.fetchData(dataFilters)
      : this.props.clearKantarData
    );
  }

  onGenreSelectChange = selectedGenre => {
    const genreId = selectedGenre
      ? parseInt(selectedGenre.value)
      : null;
    const dataFilters = mergeObjects(this.state.dataFilters, { genreId });

    this.setState({ dataFilters }, dataFilters.brandIds.length
      ? () => this.fetchData(dataFilters)
      : this.props.clearKantarData
    );
  }

  onAreaSelectChange = selectedAreas => {
    const areaIds = selectedAreas.map(value => value.value);
    const dataFilters = mergeObjects(this.state.dataFilters, { areaIds });

    this.setState({ dataFilters }, () => this.fetchData(dataFilters));
  }

  onMetricFilterChange = metric => {
    const dataFilters = mergeObjects(this.state.dataFilters, { metric });

    this.setState({ dataFilters });
  }

  barChartData = () => {
    const { kantarData, kantarBrands, kantarAreas } = this.props;
    const { dataFilters } = this.state;

    const filteredList = kantarData.list.filter(object => object[dataFilters.metric]);

    const dataRaw = _.flow([
      _.groupBy('brandId'),
      _.entries,
      _.map(([ brandId, list ]) => list.reduce(
        (acc, object) => mergeObjects(acc, {
          values: [
            ...acc.values,
            {
              areaId: object.areaId,
              year: object.year,
              quarter: object.quarter,
              value: object[dataFilters.metric]
            }
          ]
        }),
        { name: kantarBrands.table[brandId], values: [] }
      ))
    ])(filteredList);

    const chartData = dataRaw.map(list => mergeObjects(
      { name: list.name },
      list.values.reduce(
        (acc, item) => mergeObjects(acc, {
          [`${kantarAreas.table[item.areaId]}, Q${item.quarter}/${item.year}`]: item.value
        }),
        {}
      )
    ));

    return chartData;
  }

  barChartStacks = () => {
    const { kantarData, kantarAreas } = this.props;
    const { dataFilters } = this.state;

    const years = _.uniq(kantarData.list.map(item => item.year)).sort();
    const quarters = _.uniq(kantarData.list.map(item => item.quarter)).sort();

    return years
      // collect all possible periods for the current data
      .reduce((acc, year) => [
        ...acc,
        ...(quarters.map(quarter => `Q${quarter}/${year}`))
      ], [])
      // collect stacks [ [ 'data item for period 1', 'data item for period 2'] ]
      .map(period => dataFilters.areaIds.map(
        areaId => `${kantarAreas.table[areaId]}, ${period}`
      ));
  }

  shouldUsePackagingsFilter = selectedBrandIds => {
    const { kantarPackagings } = this.props;

    if (kantarPackagings.isLoading || !selectedBrandIds.length) {
      return false;
    }

    return selectedBrandIds.every(
      brandId => kantarPackagings.applicableForBrands.includes(brandId)
    );
  }

  shouldUseGenreFilter = selectedBrandIds => {
    const { kantarGenres } = this.props;

    if (kantarGenres.isLoading || !selectedBrandIds.length) {
      return false;
    }

    return selectedBrandIds.every(
      brandId => kantarGenres.applicableForBrands.includes(brandId)
    );
  }

  render() {
    const {
      kantarBrands,
      kantarAreas,
      kantarData,
      kantarPackagings,
      kantarGenres,
      metrics
    } = this.props;
    const { dataFilters } = this.state;

    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    return (
      <div>
        <Grid style={{ marginBottom: '30px' }}>
          <Col xs={12} md={8} mdOffset={2}>
            { metrics.list.length > 0 && (
              <MetricsFilters
                metrics={metrics.list}
                onChange={this.onMetricFilterChange}
                selectedValue={dataFilters.metric}
              />
            ) }
          </Col>
        </Grid>

        <Grid>
          <Col xs={12} md={4} mdOffset={2}>
            <DataFilter
              label='Choose brands'
              multi
              objects={kantarBrands.table}
              isLoading={kantarBrands.isLoading}
              onChange={this.onBrandSelectChange}
            />
          </Col>
          <Col xs={12} md={4}>
            <DataFilter
              label='Choose areas'
              multi
              objects={kantarAreas.table}
              isLoading={kantarAreas.isLoading}
              onChange={this.onAreaSelectChange}
            />
          </Col>
        </Grid>

        <Grid>
          { this.shouldUsePackagingsFilter(dataFilters.brandIds) && (
            <Col xs={12} md={4} mdOffset={2}>
              <DataFilter
                label='Choose packaging'
                objects={kantarPackagings.dictionary}
                isLoading={kantarPackagings.isLoading}
                onChange={this.onPackagingsSelectChange}
              />
            </Col>
          ) }
          { this.shouldUseGenreFilter(dataFilters.brandIds) && (
            <Col xs={12} md={4} mdOffset={this.shouldUsePackagingsFilter(dataFilters.brandIds) ? 0 : 2}>
              <DataFilter
                label='Choose genre'
                objects={kantarGenres.dictionary}
                isLoading={kantarGenres.isLoading}
                onChange={this.onGenreSelectChange}
              />
            </Col>
          ) }
        </Grid>

        { kantarData.list.length > 0 && (
          <Grid>
            <Col xs={12} md={10} mdOffset={1} style={{ marginBottom: '30px' }}>
              <StackedBarChart
                chartHeight={450}
                data={this.barChartData()}
                stacks={this.barChartStacks()}
              />
            </Col>
          </Grid>
        ) }
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(KantarBarChart);
