// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';
import classNames from 'classnames';

import PenetrationGroupIcon from './icons/penetration_icon.png';
import MarketShapeGroupIcon from './icons/Market_Share_icon.png';
import PricePositionGroupIcon from './icons/Price_Positioning_icon.png';
import DistributionGroupIcon from './icons/Distribution_Icon.png';
import BrandEquityGroupIcon from './icons/Brand_Equity_icon.png';

import PenetrationIcon from './icons/sub_Penetration/%Penetration.png';
import VolumeUnitsIcon from './icons/sub_Penetration/Volume_units.png';
import PenetrationGrowthIcon from './icons/sub_Penetration/penetration_growth.png';

import TotatMarketShareIcon from './icons/sub_Market_share/market_share.png';
import AveragePriceIcon from './icons/sub_Market_share/unit share.png';
import MarketShareGrowthIcon from './icons/sub_Market_share/market_share_growth.png';
import VolumeShareGrowth from './icons/sub_Market_share/volume_Share_growth.png';

import AverageUnitPriceIcon from './icons/sub_price/unit_price.jpg';
import VolumeBuyersIcon from './icons/sub_price/volume_of_buyers.png';
import TotalValueIcon from './icons/sub_price/Total_value.png';
import PriceGrowthIcon from './icons/sub_price/price_growth.jpg';

import NumericDistributionIcon from './icons/sub_distribution/numeric_distribution.jpg';
import WeightedDistributionIcon from './icons/sub_distribution/weighted_disribution.png';
import NumericDistributionOutIcon from './icons/sub_distribution/numeric_out_of_stock.png';
import WeightedDistributionOutIcon from './icons/sub_distribution/weighted_out_of_Stock.png';
import PopWeightedDistribution from './icons/sub_distribution/pop_icon_black.png';

import ConvictionIcon from './icons/sub_BE/conviction.jpg';
import PresenceIcon from './icons/sub_BE/presence.png';
import RelevanceIcon from './icons/sub_BE/relevance.png';
import beIcon from './icons/sub_BE/be.jpg';

// import from styles
import './MetricsFilters.css';

const groupsIcons = {
  1: PenetrationGroupIcon,
  2: MarketShapeGroupIcon,
  3: PricePositionGroupIcon,
  4: DistributionGroupIcon,
  5: BrandEquityGroupIcon,
};

const icons = {
  1: {
    penetration: PenetrationIcon,
    volumeUnits: VolumeUnitsIcon,
    penetrationGrowth: PenetrationGrowthIcon,
  },
  2: {
    totatMarketShare: TotatMarketShareIcon,
    totatVolumeShare: AveragePriceIcon,
    marketShareGrowth: MarketShareGrowthIcon,
    volumeShareGrowth: VolumeShareGrowth,
  },
  3: {
    averageUnitPrice: AverageUnitPriceIcon,
    buyers: VolumeBuyersIcon,
    value: TotalValueIcon,
    priceGrowth: PriceGrowthIcon,
  },
  4: {
    numericDistributionStock: NumericDistributionIcon,
    weightedDistributionStock: WeightedDistributionIcon,
    numericDistribution: NumericDistributionOutIcon,
    weightedDistribution: WeightedDistributionOutIcon,
    popWeightedDistribution: PopWeightedDistribution,
  },
  5: {
    presence: PresenceIcon,
    relevance: RelevanceIcon,
    conviction: ConvictionIcon,
    beValue: beIcon,
  },
};

export default class MetricsFilters extends React.Component {

  static propTypes = {
    metrics: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired),
    onChange: PropTypes.func,
    selectedValue: PropTypes.string,
  };

  static defaultProps = {
    metrics: [],
    onChange: (value) => {},
    selectedValue: null,
  }

  constructor(props, ...args) {
    super(props, ...args);

    const selectedGroup = _.find(
      (group) => group.items.some((item) => item.value === props.selectedValue),
      props.metrics
    );

    this.state = {
      selectedGroupId: _.getOr(null, 'id', selectedGroup),
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const propsToPick = ['metrics', 'selectedValue'];

    return !_.isEqual(_.pick(propsToPick, this.props), _.pick(propsToPick, nextProps))
      || !_.isEqual(this.state.selectedGroupId, nextState.selectedGroupId);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.props.selectedValue) {
      const selectedGroup = _.find(
        (group) => group.items.some((item) => item.value === nextProps.selectedValue),
        this.props.metrics
      );

      const selectedGroupId = _.getOr(null, 'id', selectedGroup);

      if (selectedGroupId !== this.state.selectedGroupId) {
        this.setState({ selectedGroupId });
      }
    }
  }

  onGroupSelect = (selectedGroupId) => {
    const { metrics, onChange } = this.props;

    const firstItem = _.getOr(
      null,
      'items[0]',
      _.find((group) => group.id === selectedGroupId, metrics)
    );

    this.setState({ selectedGroupId }, onChange(firstItem ? firstItem.value : null));
  }

  renderGroups = () => {
    const { metrics } = this.props;
    const { selectedGroupId } = this.state;

    const buttons = metrics.map((group) => {
      const props = {
        key: group.id,
        onClick: this.onGroupSelect.bind(null, group.id),
        className: classNames('metric', { '-selected': selectedGroupId === group.id }),
      };

      return (
        <span {...props}>
          <img
            src={groupsIcons[group.id]}
            className="metric-image"
            title={group.name}
          />
          { group.name }
        </span>
      );
    });

    return <div className="metrics-row">{ buttons }</div>;
  }

  renderButtons = () => {
    const { metrics, selectedValue, onChange } = this.props;
    const { selectedGroupId } = this.state;

    const items = _.getOr(
      [],
      'items',
      _.find((group) => group.id === selectedGroupId, metrics)
    );

    const buttons = items.map((metric) => {
      const props = {
        key: metric.value,
        onClick: onChange.bind(null, metric.value),
        className: classNames('metric', { '-selected': selectedValue === metric.value }),
      };

      return (
        <span {...props}>
          <img
            src={icons[selectedGroupId][metric.value]}
            className="metric-image"
            title={metric.label}
          />
          { metric.label }
        </span>
      );
    });

    return <div className="metrics-row">{ buttons }</div>;
  }

  render() {
    return (
      <div className="metrics-filters">
        { this.renderGroups() }
        { this.renderButtons() }
      </div>
    );
  }

}
