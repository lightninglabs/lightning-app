import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { color } from '../component/style';
import { ContinuousLoadNetworkSpinner } from '../component/spinner';

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});

const WaitView = ({ store }) => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <ContinuousLoadNetworkSpinner msg={store.waitScreenCopy} />
    </MainContent>
  </Background>
);

WaitView.propTypes = {
  store: PropTypes.object.isRequired,
};

export default WaitView;
