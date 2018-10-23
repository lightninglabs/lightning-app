import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { FormStretcher } from '../component/form';
import Icon from './icon';
import { InputField } from './field';

//
// Password Entry
//

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  form: {
    alignSelf: 'center',
  },
});

const PasswordEntry = ({
  placeholder,
  hidden,
  password,
  onChangeText,
  onSubmit,
  toggleHidden,
  border,
}) => (
  <View style={styles.input}>
    <FormStretcher style={styles.form}>
      <InputField
        placeholder={placeholder}
        secureTextEntry={hidden}
        autoFocus={true}
        value={password}
        onChangeText={password => onChangeText(password)}
        onSubmitEditing={() => onSubmit()}
        style={{ borderBottomColor: border }}
      />
    </FormStretcher>
    <ToggleShowButton
      borderColor={border}
      onPress={() => toggleHidden()}
      hide={hidden}
    />
  </View>
);

PasswordEntry.propTypes = {
  placeholder: PropTypes.string,
  hidden: PropTypes.bool,
  password: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  toggleHidden: PropTypes.func.isRequired,
  border: PropTypes.string,
};

//
// Toggle Show Button
//

const toggleShowStyles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 47,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hideIcon: {
    height: 69 * 0.25,
    width: 72 * 0.25,
  },
  showIcon: {
    height: 57 * 0.25,
    width: 72 * 0.25,
  },
});

const ToggleShowButton = ({ borderColor, onPress, hide }) => (
  <View
    style={[toggleShowStyles.iconWrapper, { borderBottomColor: borderColor }]}
  >
    <TouchableOpacity onPress={() => onPress()}>
      {hide ? (
        <Icon
          image={require('../asset/icon/password-hide.png')}
          style={toggleShowStyles.hideIcon}
        />
      ) : (
        <Icon
          image={require('../asset/icon/password-show.png')}
          style={toggleShowStyles.showIcon}
        />
      )}
    </TouchableOpacity>
  </View>
);

ToggleShowButton.propTypes = {
  borderColor: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  hide: PropTypes.bool.isRequired,
};

export default PasswordEntry;
