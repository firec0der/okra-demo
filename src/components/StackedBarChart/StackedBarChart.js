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

// import from utils
import { lightenColor } from '../../utils/color';

export default class StackedBarChart extends React.Component {

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired),
    chartWidth: PropTypes.number,
    chartHeight: PropTypes.number,
    yTickFormatter: PropTypes.func,
    tooltipValueFormatter: PropTypes.func,
    stacks: PropTypes.array
  }

  static defaultProps = {
    chartHeight: 300,
    chartWidth: 600,
  }

  shouldComponentUpdate(nextProps) {
    const { data, stacks } = this.props;

    return !_.isEqual(
      _.pick(['data', 'stacks'], nextProps),
      _.pick(['data', 'stacks'], this.props)
    );
  }

  renderBars() {
    const { stacks } = this.props;

    return stacks.map((listWithKeys, i) => listWithKeys.map((key, j) => (
      <Bar
        key={`${i}-${key}`}
        stackId={i}
        dataKey={key}
        fill={lightenColor(colorPalette[i], j * 5)}
      />
    )));
  }

  render() {
    const { data, chartWidth, chartHeight } = this.props;

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
          { this.renderBars() }
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

}
