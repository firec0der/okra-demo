import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { increment, doubleAsync } from '../../modules/counter';

const mapDispatchToProps = {
  increment: () => increment(1),
  doubleAsync
};

const mapStateToProps = ({ counter }) => ({
  counter
});

class CounterContainer extends React.Component {

  static propTypes = {
    counter: PropTypes.number.isRequired,
    increment: PropTypes.func.isRequired,
    doubleAsync: PropTypes.func.isRequired,
  }

  render() {
    const { counter, increment, doubleAsync } = this.props;

    return (
      <div style={{ margin: '0 auto' }} >
        <h2>Counter: { counter }</h2>
        <button className='btn btn-primary' onClick={increment}>
          Increment
        </button>
        { ' ' }
        <button className='btn btn-secondary' onClick={doubleAsync}>
          Double (Async)
        </button>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
