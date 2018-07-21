import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { Header, Title } from '../component/header';
import { Button, BackButton } from '../component/button';
import { color } from '../component/style';

//
// Common setting container
//

const styles = StyleSheet.create({
  content: {
    paddingBottom: 75,
    paddingLeft: 50,
    paddingRight: 50,
  },
  list: {
    flex: 1,
    justifyContent: 'center',
    width: 400,
  },
});

const SettingContainer = ({ children, title, nav }) => {
  return (
    <Background color={color.blackDark} style={styles.wrapper}>
      <Header separator>
        <BackButton onPress={() => nav.goSettings()} />
        <Title title={title} />
        <Button disabled onPress={() => {}} />
      </Header>
      <MainContent style={styles.content}>
        <View style={styles.list}>{children}</View>
      </MainContent>
    </Background>
  );
};

SettingContainer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.string.isRequired,
  nav: PropTypes.object.isRequired,
};

export default observer(SettingContainer);
