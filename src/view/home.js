import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { LabelBalance } from '../component/label';
import { Header, Title } from '../component/header';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});

const Home = ({ store }) => {
  const { settings, computedChannelsBalance } = store;
  return (
    <Background image="purple-gradient-bg">
      <Header separator>
        <Title title="Wallet" />
      </Header>
      <MainContent style={styles.content}>
        <LabelBalance unit={settings.unit}>
          {computedChannelsBalance}
        </LabelBalance>
      </MainContent>
    </Background>
  );
};

Home.propTypes = {
  store: PropTypes.object.isRequired,
};

export default observer(Home);
