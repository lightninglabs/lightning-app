import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Font } from 'expo';
import { CopyOnboardText } from '../src/component/text';
import { color } from '../src/component/style';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fontLoaded: false };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans Light': require('../src/asset/font/OpenSans-Light.ttf'),
      'OpenSans Regular': require('../src/asset/font/OpenSans-Regular.ttf'),
      'OpenSans SemiBold': require('../src/asset/font/OpenSans-SemiBold.ttf'),
      'OpenSans Bold': require('../src/asset/font/OpenSans-Bold.ttf'),
      'OpenSans ExtraBold': require('../src/asset/font/OpenSans-ExtraBold.ttf'),
      'Poppins Thin': require('../src/asset/font/Poppins-Thin.ttf'),
      'Poppins ExtraLight': require('../src/asset/font/Poppins-ExtraLight.ttf'),
      'Poppins Light': require('../src/asset/font/Poppins-Light.ttf'),
      'Poppins Regular': require('../src/asset/font/Poppins-Regular.ttf'),
      'Poppins Medium': require('../src/asset/font/Poppins-Medium.ttf'),
      'Poppins SemiBold': require('../src/asset/font/Poppins-SemiBold.ttf'),
      'Poppins Bold': require('../src/asset/font/Poppins-Bold.ttf'),
      'Poppins ExtraBold': require('../src/asset/font/Poppins-ExtraBold.ttf'),
      'Poppins Black': require('../src/asset/font/Poppins-Black.ttf'),
      'WorkSans Thin': require('../src/asset/font/WorkSans-Thin.ttf'),
      'WorkSans ExtraLight': require('../src/asset/font/WorkSans-ExtraLight.ttf'),
      'WorkSans Light': require('../src/asset/font/WorkSans-Light.ttf'),
      'WorkSans Regular': require('../src/asset/font/WorkSans-Regular.ttf'),
      'WorkSans Medium': require('../src/asset/font/WorkSans-Medium.ttf'),
      'WorkSans SemiBold': require('../src/asset/font/WorkSans-SemiBold.ttf'),
      'WorkSans Bold': require('../src/asset/font/WorkSans-Bold.ttf'),
      'WorkSans ExtraBold': require('../src/asset/font/WorkSans-ExtraBold.ttf'),
      'WorkSans Black': require('../src/asset/font/WorkSans-Black.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.fontLoaded ? (
          <CopyOnboardText style={styles.text}>
            Open up App.js to start working on your app!
          </CopyOnboardText>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: color.black,
  },
});
