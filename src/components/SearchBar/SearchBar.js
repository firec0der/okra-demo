// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

export default class SearchBar extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    buttonText: PropTypes.string
  }

  static defaultProps = {
    value: '',
    onChange: (value) => {},
    onSubmit: (value) => {},
    buttonText: 'Search'
  }

  constructor(props, ...args) {
    super(props, ...args);

    this.state = { value: props.value };
  }

  onSubmit = () => this.props.onSubmit(this.state.value);

  onChange = (event) => {
    const { value } = event.target;
    this.setState({ value }, this.props.onChange.bind(null, value));
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') { this.onSubmit(); }
  }

  render() {
    const { buttonText, placeholder } = this.props;
    const { value } = this.state;

    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      style: { borderColor: '#007dbb' }
    };

    return (
      <div className='search-bar'>
        <FormGroup>
          <InputGroup>
            <FormControl type='text' {...inputProps} />
            <InputGroup.Button>
              <Button style={{ borderColor: '#007dbb', color: '#007dbb' }} onClick={this.onSubmit}>
                { buttonText }
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </div>
    );
  }

}
