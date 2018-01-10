// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import _ from 'lodash/fp';

import MicrophoneIcon from './microphone.png';

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
    buttonText: 'Search',
    recognition: false
  }

  constructor(props, ...args) {
    super(props, ...args);

    this.state = { value: props.value };
  }

  onSubmit = () => this.props.onSubmit(this.state.value);

  onChange = event => {
    const { value } = event.target;
    this.setState({ value }, this.props.onChange.bind(null, value));
  };

  onKeyPress = event => {
    if (event.key === 'Enter') { this.onSubmit(); }
  };

  onSpeechRecognition = event => {
    this.setState({ recognition: true }, () => {
      const recognition = new window.webkitSpeechRecognition();

      recognition.onresult = (event) => {
        const transcript = _.getOr('', 'results[0][0].transcript', event);

        transcript && this.setState(
          { value: transcript, recognition: false },
          this.props.onChange.bind(null, transcript)
        );
      };

      recognition.start();
    });
  };

  render() {
    const { buttonText, placeholder } = this.props;
    const { value, recognition } = this.state;

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
              { window.webkitSpeechRecognition && (
                <Button
                  style={{ borderColor: '#007dbb', color: '#007dbb' }}
                  onClick={this.onSpeechRecognition}
                  disabled={recognition}
                >
                  <img src={MicrophoneIcon} style={{ height: '18px' }} />
                </Button>
              ) }
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
