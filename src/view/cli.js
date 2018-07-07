import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import Text from '../component/text';
import { List, ListContent } from '../component/list';
import { Button, BackButton } from '../component/button';
import { color, font } from '../component/style';

//
// CLI View
//

const CLIView = ({ store, nav }) => (
  <Background color={color.blackDark}>
    <Header separator>
      <BackButton onPress={() => nav.goSettings()} />
      <Title title="CLI" />
      <Button disabled onPress={() => {}} />
    </Header>
    <Background color={color.cliBackground}>
      <List
        data={store.logs.slice()}
        renderItem={text => <LogItem text={text} />}
        scrollToEnd={true}
      />
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
    fontSize: font.sizeS,
    paddingLeft: 50,
    paddingRight: 50,
  },
});

const LogItem = ({ text }) => <Text style={iStyles.text}>{text}</Text>;

LogItem.propTypes = {
  text: PropTypes.string,
};

export default observer(CLIView);
