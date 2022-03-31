import React, { Component } from 'react';
import './ToggleSwitch.css';

class ToggleSwitch extends Component {
  render() {
    return (
      <div className='toggle-switch'>
        <input
          onClick={this.props.onClick}
          type='checkbox'
          className='toggle-switch-checkbox'
          name={this.props.name}
          id={this.props.name}
        />
        <label className='toggle-switch-label' htmlFor={this.props.name}>
          <span className='toggle-switch-inner' />
          <span className='toggle-switch-switch' />
        </label>
      </div>
    );
  }
}

export default ToggleSwitch;

// code adapated from
// https://www.geeksforgeeks.org/how-to-create-a-toggle-switch-in-react-as-a-reusable-component/
