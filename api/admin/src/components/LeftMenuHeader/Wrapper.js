import styled from 'styled-components';
import PropTypes from 'prop-types';

import Logo from '../../assets/images/gw-banner.jpg';

const Wrapper = styled.div`
  background-color: #cd601e;
  padding-left: 2rem;
  height: ${props => props.theme.main.sizes.leftMenu.height};
  .leftMenuHeaderLink {
    &:hover {
      text-decoration: none;
    }
  }
  .sgHeaderLogo {
    height: ${props => props.theme.main.sizes.leftMenu.height};
    width: auto;
    float: left;
    padding: 2px 5px;
  }
  .projectName {
    display: block;
    width: 100%;
    height: ${props => props.theme.main.sizes.leftMenu.height};
    font-size: 2rem;
    letter-spacing: 0.2rem;
    color: $white;
    background-image: url(${Logo});
    background-repeat: no-repeat;
    background-size: cover;
  }
`;

Wrapper.defaultProps = {
  theme: {
    main: {
      colors: {
        leftMenu: {},
      },
      sizes: {
        header: {},
        leftMenu: {},
      },
    },
  },
};

Wrapper.propTypes = {
  theme: PropTypes.object,
};

export default Wrapper;