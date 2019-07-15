import React from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import KeepAwake from 'expo-keep-awake';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DropdownAlert from 'react-native-dropdownalert';
import { Alert } from './notification';
import { SmallSpinner } from './spinner';
import { color, font } from './style';
import { NOTIFICATION_DELAY } from '../config';

//
// Notification Wrapper
//

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: color.blackDark,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 0,
  },
  text: {
    fontFamily: 'OpenSans Regular',
    fontSize: font.sizeXS,
    lineHeight: font.lineHeightXS,
    color: color.white,
  },
  alert: {
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 2,
  },
  spinner: {
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 6,
  },
});

const NotificationWrapper = ({ store, notify, children }) => (
  <View style={styles.wrapper}>
    {children}
    <DropdownAlert
      ref={ref => notify.setDropdown(ref)}
      containerStyle={styles.dropdown}
      messageStyle={styles.text}
      renderImage={() => (
        <Alert
          type={(store.lastNotification || {}).type}
          style={styles.alert}
        />
      )}
      showCancel={(store.lastNotification || {}).waiting}
      renderCancel={() => <SmallSpinner style={styles.spinner} />}
      closeInterval={NOTIFICATION_DELAY}
      replaceEnabled={false}
      updateStatusBar={false}
    />
    {(store.lastNotification || {}).waiting ? <KeepAwake /> : null}
  </View>
);

NotificationWrapper.propTypes = {
  store: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default observer(NotificationWrapper);
