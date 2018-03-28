import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from './text';
import { View } from 'react-native';
import { colors } from './styles';

class ComponentHeader extends Component {
  render() {
    const { text, description, style } = this.props;

    return (
      <View style={style}>
        <Text style={{ color: colors.gray, fontSize: 24, marginBottom: 14 }}>
          {text}
        </Text>
        <Text style={{ color: colors.lightgray }}>{description}</Text>
      </View>
    );
  }
}

ComponentHeader.propTypes = {
  text: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
};

export default ComponentHeader;
