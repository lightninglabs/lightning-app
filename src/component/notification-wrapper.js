import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { NotificationBar } from './notification';

//
// Notification Wrapper
//

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

const NotificationWrapper = ({ store, children }) => {
  const { lastNotification, displayNotification } = store;
  return (
    <View style={styles.wrapper}>
      <NotificationBar
        notification={lastNotification}
        display={displayNotification}
      />
      {children}
    </View>
  );
};

NotificationWrapper.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default observer(NotificationWrapper);
