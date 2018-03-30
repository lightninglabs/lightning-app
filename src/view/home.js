import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { BalanceLabel } from '../component/label';
import { Header, Title } from '../component/header';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});

const Home = ({ store }) => {
  const { channelBalanceLabel, unitLabel } = store;
  return (
    <Background image="purple-gradient-bg">
      <Header separator>
        <Title title="Wallet" />
      </Header>
      <MainContent style={styles.content}>
        <BalanceLabel unit={unitLabel}>{channelBalanceLabel}</BalanceLabel>
      </MainContent>
    </Background>
  );
};

Home.propTypes = {
  store: PropTypes.object.isRequired,
};

export default observer(Home);
