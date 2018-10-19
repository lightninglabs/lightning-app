import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { FormStretcher } from '../component/form';
import { InputField } from '../component/field';
import { ToggleShowButton } from '../component/button';

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

export default PasswordEntry;
