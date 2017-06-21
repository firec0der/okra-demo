// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// import from constants
import {
  LEVEL_FILTER,
  CHANNEL_FILTER,
  AREA_FILTER,
  GENRE_FILTER,
  PACKAGING_FILTER,
  DATA_FILTERS_CONFIG
} from '../../constants/dataFilters';

// import from containers
import PeriodsBarChart from '../../containers/PeriodsBarChart/PeriodsBarChart';
import NielsenPeriodsLineChart from '../../containers/NielsenPeriodsLineChart/NielsenPeriodsLineChart';

export default class Q1Page extends React.Component {

  render() {
    const barChartDataFilters = [
      AREA_FILTER,
      CHANNEL_FILTER,
      GENRE_FILTER,
      PACKAGING_FILTER
    ];

    const barChartRequiredFilters = [
      AREA_FILTER
    ];

    const barChartValues = {
      [DATA_FILTERS_CONFIG[CHANNEL_FILTER].key]: 1,
      [DATA_FILTERS_CONFIG[LEVEL_FILTER].key]: 2,
      [DATA_FILTERS_CONFIG[GENRE_FILTER].key]: 1,
      [DATA_FILTERS_CONFIG[AREA_FILTER].key]: [1],
    };

    const lineChartDataFilters = [
      AREA_FILTER,
      GENRE_FILTER,
      PACKAGING_FILTER
    ];

    const lineChartRequiredFilters = [
      AREA_FILTER
    ];

    const lineChartValues = {
      [DATA_FILTERS_CONFIG[CHANNEL_FILTER].key]: 1,
      [DATA_FILTERS_CONFIG[LEVEL_FILTER].key]: 2,
      [DATA_FILTERS_CONFIG[GENRE_FILTER].key]: 1,
      [DATA_FILTERS_CONFIG[AREA_FILTER].key]: [1],
    };

    return (
      <div className='home-page'>
        <Grid style={{ marginBottom: '30px' }}>
          <Col xs={12} md={8} mdOffset={2}>
            <h4 className='text-center'>
              What is the market share of female deodorants in supermarkets?
            </h4>
          </Col>
        </Grid>

        <PeriodsBarChart
          dataFilters={barChartDataFilters}
          values={barChartValues}
          requiredFilters={barChartRequiredFilters}
          chosenMetric='weightedDistribution'
        />
        <NielsenPeriodsLineChart
          dataFilters={lineChartDataFilters}
          values={lineChartValues}
          requiredFilters={lineChartRequiredFilters}
          chosenMetric='weightedDistribution'
        />
      </div>
    );
  }

}
