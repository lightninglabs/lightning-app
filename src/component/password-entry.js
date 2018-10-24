import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from './icon';
import { InputField } from './field';
import { color } from './style';

//
// Password Entry
//

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
});

export class PasswordEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidePassword: true,
    };
  }

  render() {
    const { success, style, ...props } = this.props;
    let border;
    if (typeof success !== 'boolean') {
      border = color.blackDark;
    } else {
      border = success ? color.green : color.red;
    }
    return (
      <View style={[styles.wrapper, style]}>
        <InputField
          secureTextEntry={this.state.hidePassword}
          {...props}
          style={[styles.input, { borderBottomColor: border }]}
        />
        <ToggleShowButton
          borderColor={border}
          onPress={() =>
            this.setState({ hidePassword: !this.state.hidePassword })
          }
          hide={this.state.hidePassword}
        />
      </View>
    );
  }
}

PasswordEntry.propTypes = {
  success: PropTypes.bool,
  style: View.propTypes.style,
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
