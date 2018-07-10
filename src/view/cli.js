import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import Text from '../component/text';
import { Button, BackButton } from '../component/button';
import { color, font } from '../component/style';

//
// CLI View
//

const styles = StyleSheet.create({
  header: {
    marginBottom: 1, // display separator above output background color
  },
});

const CLIView = ({ store, nav }) => (
  <Background color={color.blackDark}>
    <Header separator style={styles.header}>
      <BackButton onPress={() => nav.goSettings()} />
      <Title title="Logs" />
      <Button disabled onPress={() => {}} />
    </Header>
    <LogOutput logs={store.logs.slice()} />
  </Background>
);

CLIView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

//
// Log Output
//

const logStyles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: color.cliBackground,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 50,
    paddingRight: 50,
  },
  text: {
    textAlign: 'left',
    fontSize: font.sizeS,
  },
});

class LogOutput extends Component {
  constructor(props) {
    super(props);
    this._ref = React.createRef();
  }

  get printLogs() {
    setTimeout(() => this._ref.current.scrollToEnd(), 50);
    return this.props.logs.map(l => l.replace(/\s+$/, '')).join('\n');
  }

  render() {
    return (
      <ScrollView ref={this._ref} contentContainerStyle={logStyles.content}>
        <Text style={logStyles.text}>{this.printLogs}</Text>
      </ScrollView>
    );
  }
}

LogOutput.propTypes = {
  logs: PropTypes.array.isRequired,
};

export default observer(CLIView);
