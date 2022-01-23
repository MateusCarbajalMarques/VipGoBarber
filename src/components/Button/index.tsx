import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string;

}
//^2.2.4
const Button: React.FC<ButtonProps> = ({ children, ... rest }) =>
(
  <Container {... rest}>
    <ButtonText>
      {children}
    </ButtonText>
  </Container>);

export default Button;
