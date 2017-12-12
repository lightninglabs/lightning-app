import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TextB } from '../components/text';
import { View } from 'react-native';
import { colors } from '../styles';

class ComponentHeader extends Component {
  render() {
    const { text, description } = this.props;

    return (
      <View>
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
};

export default ComponentHeader;
