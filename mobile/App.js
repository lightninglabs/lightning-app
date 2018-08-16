import React from 'react';
import FontLoader from './component/font-loader';
import Container from '../src/component/container';
import Background from '../src/component/background';
import { Header, Title } from '../src/component/header';
import BitcoinIcon from '../src/asset/icon/bitcoin';
import { CancelButton, BackButton } from '../src/component/button';
import { color } from '../src/component/style';

export default class App extends React.Component {
  render() {
    return (
      <FontLoader>
        <TestView />
      </FontLoader>
    );
  }
}

const TestView = () => (
  <Container>
    <Background image="orange-gradient-bg">
      <Header shadow color={color.orange}>
        <BackButton onPress={() => {}} />
        <Title title="On-Chain Payment">
          <BitcoinIcon height={13.6} width={10.8} />
        </Title>
        <CancelButton onPress={() => {}} />
      </Header>
    </Background>
  </Container>
);
