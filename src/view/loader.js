import React from 'react';
import { StyleSheet, View } from 'react-native';
import Background from '../component/background';
import { CopyText } from '../component/text';
import { FormStretcher } from '../component/form';
import Icon from '../component/icon';
import { color } from '../component/style';

const styles = StyleSheet.create({
  copyTxt: {
    flexDirection: 'row',
    fontSize: 53,
  },
  boltBackground: {
    height: 46,
    width: 25,
    marginLeft: 26,
    backgroundColor: '#57038D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolt: {
    height: 37,
    width: 19,
  },
});

const LoaderView = () => (
  <Background color={color.blackDark}>
    <FormStretcher>
      <CopyText style={styles.copyTxt}>
        The fastest way to transfer Bitcoin.<Bolt />
      </CopyText>
    </FormStretcher>
  </Background>
);

const Bolt = () => (
  <View style={styles.boltBackground}>
    <Icon image="lightning-bolt" style={styles.bolt} />
  </View>
);

export default LoaderView;
