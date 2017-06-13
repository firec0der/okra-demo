// import from vendor
import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer
} from 'recharts';
import _ from 'lodash/fp';

// import from styles
// import from constants
import { colorPalette } from '../../constants/colors';

export default class StackedBarChart extends React.Component {

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired),
    chartWidth: PropTypes.number,
    chartHeight: PropTypes.number,
    yTickFormatter: PropTypes.func,
    tooltipValueFormatter: PropTypes.func
  }

  static defaultProps = {
    chartHeight: 300,
    chartWidth: 600
  }

  shouldComponentUpdate({ data: nextData }) {
    const { data } = this.props;

    return !_.isEqual(data, nextData);
  }

  getDataKeys(data) {
    return _.uniq(
      data
        .map(dataItem => Object.keys(_.omit('name', dataItem)))
        .reduce((acc, keys) => [...acc, ...keys], [])
    );
  }

  render() {
    const { data, chartWidth, chartHeight } = this.props;

    const keys = this.getDataKeys(data);

    const barChartProps = {
      width: chartWidth,
      height: chartHeight,
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      barGap: 0
    };

    return (
      <ResponsiveContainer width='100%' height={chartHeight}>
        <RechartsBarChart {...barChartProps}>
          <XAxis dataKey='name' />
          <YAxis tickCount={10} />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <Legend />
          { keys.map((key, index) => <Bar key={index} dataKey={key} fill={colorPalette[index]} />) }
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

}
