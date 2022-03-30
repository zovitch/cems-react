import React from 'react';
import { Link } from 'react-router-dom';

const DashBoardCard = ({ item: { name, nameCN, route, faLogo, color } }) => {
  return (
    <Link to={`/${route}`}>
      <div className='card bg-light'>
        <h1>
          <i className={`fas ${faLogo} fa-2xl ${color}`}></i>
        </h1>
        <br />
        <h1 className={color}> {name[0].toUpperCase() + name.substring(1)} </h1>
        <h1 className={color}> {nameCN} </h1>
      </div>
    </Link>
  );
};

export default DashBoardCard;
