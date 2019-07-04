import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MainContent from '../component/main-content';
import { SplitBackground } from '../component/background';
import ShieldIcon from '../asset/icon/shield';
import { H1Text, CopyText } from '../component/text';
import { GlasButton } from '../component/button';
import { color } from '../component/style';

//
// Reset Pin: Saved View
//

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
  },
  copy: {
    textAlign: 'center',
    maxWidth: 330,
  },
});

const ResetPinSaved = ({ nav }) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <MainContent>
      <View style={styles.wrapper}>
        <View style={styles.icon}>
          <ShieldIcon height={164} width={210} />
        </View>
        <H1Text style={styles.title}>PIN saved!</H1Text>
        <CopyText style={styles.copy}>{'Your new PIN is now saved.'}</CopyText>
      </View>
      <GlasButton onPress={() => nav.goHome()}>Done</GlasButton>
    </MainContent>
  </SplitBackground>
);

ResetPinSaved.propTypes = {
  nav: PropTypes.object.isRequired,
};

export default ResetPinSaved;
