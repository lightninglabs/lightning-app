import React, { Component } from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { SplitBackground } from '../component/background';
import { Header, Title } from '../component/header';
import Text from '../component/text';
import { BackButton, ShareButton, Button } from '../component/button';
import { createStyles, maxWidth } from '../component/media-query';
import { color, font, breakWidth } from '../component/style';

//
// CLI View
//

const styles = StyleSheet.create({
  header: {
    marginBottom: 1, // display separator above output background color
  },
});

const CLIView = ({ store, nav, file }) => (
  <SplitBackground color={color.blackDark} bottom={color.cliBackground}>
    <Header separator style={styles.header}>
      <BackButton onPress={() => nav.goSettings()} />
      <Title title="Logs" />
      {Platform.OS === 'web' ? (
        <Button disabled onPress={() => {}} />
      ) : (
        <ShareButton onPress={() => file.shareLogs()} />
      )}
    </Header>
    <LogOutput logs={store.logs} />
  </SplitBackground>
);

CLIView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  file: PropTypes.object,
};

//
// Log Output
//

const baseLogStyles = {
  content: {
    flexGrow: 1,
    backgroundColor: color.cliBackground,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 50,
    paddingRight: 50,
  },
  text: {
    fontSize: font.sizeS,
  },
};

const logStyles = createStyles(
  baseLogStyles,

  maxWidth(breakWidth, {
    content: {
      paddingLeft: 20,
      paddingRight: 20,
    },
  })
);

class LogOutput extends Component {
  constructor(props) {
    super(props);
    this._refresh = true;
    this._ref = React.createRef();
  }

  shouldComponentUpdate() {
    const current = this._refresh;
    this._refresh = false;
    setTimeout(() => {
      this._refresh = true;
    }, 100);
    if (!current) {
      clearTimeout(this._tLast);
      this._tLast = setTimeout(() => this.forceUpdate(), 500);
    }
    return current;
  }

  componentWillUnmount() {
    clearTimeout(this._tLast);
    clearTimeout(this._tScroll);
  }

  get printLogs() {
    this._tScroll = setTimeout(() => this.tailLogs(), 50);
    return this.props.logs;
  }

  tailLogs() {
    const view = this._ref && this._ref.current;
    view && view.scrollToEnd({ animated: false });
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
  logs: PropTypes.string.isRequired,
};

export default observer(CLIView);
