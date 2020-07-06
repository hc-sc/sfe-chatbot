import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/gw-logo.svg';

import Wrapper from './Wrapper';

const LeftMenuHeader = () => (
  <Wrapper>
    <Link to="/" className="leftMenuHeaderLink">
      <img src={ Logo } className="sgHeaderLogo" />
      <span className="projectName" />
    </Link>
  </Wrapper>
);

export default LeftMenuHeader;