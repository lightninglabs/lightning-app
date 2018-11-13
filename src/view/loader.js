import React from 'react';
import { View } from 'react-native';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import { CopyOnboardText } from '../component/text';
import MainContent from '../component/main-content';
import { color, invisible, breakWidth } from '../component/style';

const baseStyles = {
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    justifyContent: 'center',
    maxWidth: 720,
    paddingLeft: 30,
    paddingRight: 30,
  },
  boltBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    width: 25,
    marginLeft: 26,
    backgroundColor: color.purple,
  },
  copy2: {
    marginTop: 25,
    paddingRight: 200,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(breakWidth, {
    copy2: invisible,
  })
);

const LoaderView = () => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <View style={styles.copy}>
        <CopyOnboardText>The fastest way to transfer Bitcoin.</CopyOnboardText>
        <CopyOnboardText style={styles.copy2}>
          The most advanced easy-to-use wallet.
        </CopyOnboardText>
      </View>
    </MainContent>
  </Background>
);

export default LoaderView;
