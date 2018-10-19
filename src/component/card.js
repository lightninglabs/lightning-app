import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import PasswordEntry from './password-entry';
import { FormSubText } from '../component/form';
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
  entry: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  newCopy: {
    maxWidth: 250,
    color: color.blackText,
    height: font.lineHeightSub * 2,
  },
});

export class PasswordCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidePassword: true,
    };
  }

  render() {
    const {
      copy,
      placeholder,
      password,
      onChangeText,
      onSubmit,
      newPassword,
      newCopy,
      border,
    } = this.props;
    return (
      <Card style={passwordStyles.card}>
        <FormSubText>{copy}</FormSubText>
        <View style={passwordStyles.entry}>
          <PasswordEntry
            placeholder={placeholder}
            hidden={this.state.hidePassword}
            password={password}
            onChangeText={password => onChangeText(password)}
            onSubmit={() => onSubmit()}
            toggleHidden={() =>
              this.setState({ hidePassword: !this.state.hidePassword })
            }
            border={newPassword ? border : color.blackDark}
            icon={this.state.hidePassword}
          />
          <FormSubText style={passwordStyles.newCopy}>{newCopy}</FormSubText>
        </View>
      </Card>
    );
  }
}

PasswordCard.propTypes = {
  copy: PropTypes.string,
  placeholder: PropTypes.string,
  password: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  newPassword: PropTypes.bool,
  newCopy: PropTypes.string,
  border: PropTypes.string,
};

export default Card;
