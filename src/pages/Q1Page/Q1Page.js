// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// import from constants
import {
  CHANNEL_FILTER,
  BRAND_FILTER,
  AREA_FILTER,
  GENRE_FILTER,
  PACKAGING_FILTER,
  SUBCATEGORY_FILTER,
  DATA_FILTERS_CONFIG,
} from '../../constants/dataFilters';

// import from containers
import PeriodsBarChart from '../../containers/PeriodsBarChart/PeriodsBarChart';
import PeriodsLineChart from '../../containers/PeriodsLineChart/PeriodsLineChart';

export default class Q1Page extends React.Component {

  render() {
    const barChartDataFilters = [
      SUBCATEGORY_FILTER,
      BRAND_FILTER,
      AREA_FILTER,
      CHANNEL_FILTER,
      GENRE_FILTER,
      PACKAGING_FILTER,
    ];

    const barChartRequiredFilters = [];

    const barChartValues = {
      [DATA_FILTERS_CONFIG[CHANNEL_FILTER].key]: 1,
      [DATA_FILTERS_CONFIG[AREA_FILTER].key]: [8],
      [DATA_FILTERS_CONFIG[BRAND_FILTER].key]: [2, 3, 4],
    };

    const lineChartDataFilters = [
      SUBCATEGORY_FILTER,
      BRAND_FILTER,
      AREA_FILTER,
      CHANNEL_FILTER,
      GENRE_FILTER,
      PACKAGING_FILTER,
    ];

    const lineChartRequiredFilters = [];

    const lineChartValues = {
      [DATA_FILTERS_CONFIG[CHANNEL_FILTER].key]: 1,
      [DATA_FILTERS_CONFIG[AREA_FILTER].key]: [8],
      [DATA_FILTERS_CONFIG[BRAND_FILTER].key]: [2, 3, 4],
    };

    return (
      <div className="home-page">
        <PeriodsBarChart
          dataFilters={barChartDataFilters}
          dataFiltersValues={barChartValues}
          requiredFilters={barChartRequiredFilters}
          chosenMetric="weightedDistribution"
        />
        <PeriodsLineChart
          dataFilters={lineChartDataFilters}
          dataFiltersValues={lineChartValues}
          requiredFilters={lineChartRequiredFilters}
          chosenMetric="marketShareGrowth"
        />
      </div>
    );
  }

}
