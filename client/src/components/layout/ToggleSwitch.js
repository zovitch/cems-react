import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = (props) => {
  return (
    <div className='toggle-switch'>
      <input
        onClick={props.onClick}
        onChange={props.onChange}
        type='checkbox'
        className='toggle-switch-checkbox'
        name={props.name}
        id={props.name}
        defaultChecked={props.defaultChecked}
      />
      <label className={props.color} htmlFor={props.name}>
        <span className='toggle-switch-inner' />
        <span className='toggle-switch-switch' />
      </label>
    </div>
  );
};

export default ToggleSwitch;
