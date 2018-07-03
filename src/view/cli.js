import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import Text from '../component/text';
import { Button, BackButton } from '../component/button';
import { color, font } from '../component/style';

//
// CLI View
//

const styles = StyleSheet.create({
  content: {
    alignItems: 'flex-start',
    paddingBottom: 30,
    paddingLeft: 50,
    paddingRight: 50,
  },
  list: {
    flex: 1,
    justifyContent: 'center',
    width: 400,
  },
});

const CLIView = ({ store, nav }) => (
  <Background color={color.blackDark} style={styles.wrapper}>
    <Header separator>
      <BackButton onPress={() => nav.goSettings()} />
      <Title title="CLI" />
      <Button disabled onPress={() => {}} />
    </Header>
    <Background color={color.cliBackground}>
      <MainContent style={styles.content}>
        {store.logs.map((log, i) => <LogItem text={log} key={i} />)}
      </MainContent>
    </Background>
  </Background>
);

CLIView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

const iStyles = StyleSheet.create({
  text: {
    textAlign: 'left',
    lineHeight: 34,
    fontSize: font.sizeM,
  },
});

const LogItem = ({ text }) => <Text style={iStyles.text}>{text}</Text>;

LogItem.propTypes = {
  text: PropTypes.string,
};

export default CLIView;
