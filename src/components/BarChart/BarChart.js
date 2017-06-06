// import from vendor
import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart as RCHBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar
} from 'recharts';
import _ from 'lodash/fp';

// import from styles
import './BarChart.scss';

// import from constants
import { colorPalette } from '../../constants/colors';

export default class BarChart extends React.Component {

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
    chartWidth: 600,
    yTickFormatter: value => `${value}%`,
    tooltipValueFormatter: value => `${value}%`
  }

  shouldComponentUpdate({ data: nextData }) {
    const { data } = this.props;

    return !_.isEqual(data, nextData);
  }

  render() {
    const { data, chartWidth, chartHeight, yTickFormatter, tooltipValueFormatter } = this.props;

    const barChartProps = {
      width: chartWidth,
      height: chartHeight,
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      barGap: 0
    };

    return (
      <RCHBarChart {...barChartProps}>
        <XAxis dataKey='name' />
        <YAxis tickCount={10} tickFormatter={yTickFormatter} />
        <CartesianGrid strokeDasharray='3 3' />
        <Tooltip formatter={tooltipValueFormatter} />
        <Legend />
        <Bar dataKey='2007' fill={colorPalette[0]} />
        <Bar dataKey='2008' fill={colorPalette[1]} />
        <Bar dataKey='2009' fill={colorPalette[2]} />
      </RCHBarChart>
    );
  }

}
