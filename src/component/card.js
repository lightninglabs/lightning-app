import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import PasswordEntry from './password-entry';
import { FormSubText, FormStretcher } from '../component/form';
import { color, font } from './style';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: color.whiteBg,
    width: 500,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 25,
    paddingBottom: 70,
  },
});

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

Card.propTypes = {
  children: PropTypes.node,
  style: View.propTypes.style,
};

const passwordStyles = StyleSheet.create({
  card: {
    maxHeight: 420,
    maxWidth: 680,
    paddingLeft: 55,
    paddingRight: 55,
    paddingBottom: 50,
  },
  newCopy: {
    marginTop: 10,
    maxWidth: 250,
    color: color.blackText,
    height: font.lineHeightSub * 2,
  },
});

export class PasswordCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      copy,
      placeholder,
      password,
      onChangeText,
      onSubmitEditing,
      newCopy,
      success,
    } = this.props;
    return (
      <Card style={passwordStyles.card}>
        <FormSubText>{copy}</FormSubText>
        <FormStretcher>
          <PasswordEntry
            placeholder={placeholder}
            value={password}
            autoFocus={true}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            success={success}
          />
          <FormSubText style={passwordStyles.newCopy}>{newCopy}</FormSubText>
        </FormStretcher>
      </Card>
    );
  }
}

PasswordCard.propTypes = {
  copy: PropTypes.string,
  placeholder: PropTypes.string,
  password: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  newCopy: PropTypes.string,
  success: PropTypes.bool,
};

export default Card;
