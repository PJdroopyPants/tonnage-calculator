import React from 'react';
import styled from '@emotion/styled';

const HeaderContainer = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 20px;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  flex-grow: 1;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>SUTHERLAND</Logo>
      <Title>Press Tonnage Calculator</Title>
    </HeaderContainer>
  );
};

export default Header; 