import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MainContent from '../component/main-content';
import Background from '../component/background';
import ShieldIcon from '../asset/icon/shield';
import { H1Text, CopyText } from '../component/text';
import { GlasButton } from '../component/button';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginTop: 50,
  },
  copy: {
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 330,
  },
});

const SeedSuccessView = ({ wallet }) => (
  <Background image="purple-gradient-bg">
    <MainContent>
      <View style={styles.wrapper}>
        <ShieldIcon height={281 * 0.75} width={218 * 0.75} />
        <H1Text style={styles.title}>Good job you!</H1Text>
        <CopyText style={styles.copy}>
          {
            "Now that you're safe and secure, let's get some coin into your wallet."
          }
        </CopyText>
      </View>
      <GlasButton onPress={() => wallet.initInitialDeposit()}>
        Add some coin
      </GlasButton>
    </MainContent>
  </Background>
);

SeedSuccessView.propTypes = {
  wallet: PropTypes.object.isRequired,
};

export default SeedSuccessView;
