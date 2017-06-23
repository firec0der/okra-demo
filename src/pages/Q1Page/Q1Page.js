// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// import from constants
import {
  CHANNEL_FILTER,
  AREA_FILTER,
  GENRE_FILTER,
  PACKAGING_FILTER,
  SUBCATEGORY_FILTER,
  DATA_FILTERS_CONFIG
} from '../../constants/dataFilters';

// import from containers
import PeriodsBarChart from '../../containers/PeriodsBarChart/PeriodsBarChart';
import NielsenPeriodsLineChart from '../../containers/Nielsen/PeriodsLineChart/NielsenPeriodsLineChart';

export default class Q1Page extends React.Component {

  render() {
    const barChartDataFilters = [
      SUBCATEGORY_FILTER,
      AREA_FILTER,
      CHANNEL_FILTER,
      GENRE_FILTER,
      PACKAGING_FILTER
    ];

    const barChartRequiredFilters = [];

    const barChartValues = {
      [DATA_FILTERS_CONFIG[CHANNEL_FILTER].key]: 1,
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
          dataFiltersValues={barChartValues}
          requiredFilters={barChartRequiredFilters}
          chosenMetric='weightedDistribution'
        />
        {/*<NielsenPeriodsLineChart*/}
          {/*dataFilters={lineChartDataFilters}*/}
          {/*values={lineChartValues}*/}
          {/*requiredFilters={lineChartRequiredFilters}*/}
          {/*chosenMetric='weightedDistribution'*/}
        {/*/>*/}
      </div>
    );
  }

}
