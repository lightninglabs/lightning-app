import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Background from '../component/background';
import { CopyOnboardText } from '../component/text';
import MainContent from '../component/main-content';
import { color } from '../component/style';
import LightningBoltIcon from '../asset/icon/lightning-bolt';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  copy: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 30,
    paddingRight: 30,
  },
  boltContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    marginLeft: 6,
  },
  boltBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: color.purple,
  },
});

const LoaderMobileView = () => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <View style={styles.copy}>
        <Text>
          <CopyOnboardText>
            The fastest way to transfer Bitcoin.
          </CopyOnboardText>
          <View style={styles.boltContainer}>
            <View style={styles.boltBackground}>
              <LightningBoltIcon height={15} width={7.6} />
            </View>
          </View>
        </Text>
      </View>
    </MainContent>
  </Background>
);

export default LoaderMobileView;
