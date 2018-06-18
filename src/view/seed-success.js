import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MainContent from '../component/main-content';
import Background from '../component/background';
import Icon from '../component/icon';
import { H1Text, CopyText } from '../component/text';
import { GlasButton } from '../component/button';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    height: 281 * 0.75,
    width: 218 * 0.75,
    marginBottom: 50,
  },
  title: {
    marginBottom: 10,
  },
  copy: {
    textAlign: 'center',
    maxWidth: 330,
  },
});

const SeedSuccessView = ({ nav }) => (
  <Background image="purple-gradient-bg">
    <MainContent>
      <View style={styles.wrapper}>
        <Icon image="shield" style={styles.icon} />
        <H1Text style={styles.title}>Good job you!</H1Text>
        <CopyText style={styles.copy}>
          {
            "Now that you're safe and secure, let's get some coin into your wallet."
          }
        </CopyText>
      </View>
      <GlasButton onPress={() => nav.goNewAddress()}>Add some coin</GlasButton>
    </MainContent>
  </Background>
);

SeedSuccessView.propTypes = {
  nav: PropTypes.object.isRequired,
};

export default SeedSuccessView;
