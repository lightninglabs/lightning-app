import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});

export class AdjustingLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      elementWidth: 0,
    };
    this.onLayoutHandler = this.onLayoutHandler.bind(this);
  }

  onLayoutHandler(event, key) {
    const { width } = event.nativeEvent.layout;
    this.setState({ [key]: width });
  }

  render() {
    const { children, style, ...rest } = this.props;
    const { containerWidth, elementWidth } = this.state;
    const maxWidth = containerWidth - elementWidth;

    return (
      <View
        style={[styles.container, style]}
        onLayout={event => this.onLayoutHandler(event, 'containerWidth')}
        {...rest}
      >
        {React.cloneElement(children[0], {
          maxWidth,
        })}
        <View onLayout={event => this.onLayoutHandler(event, 'elementWidth')}>
          {children[1]}
        </View>
      </View>
    );
  }
}

AdjustingLayout.propTypes = {
  children: PropTypes.node.isRequired,
  style: View.propTypes.style,
};

export default AdjustingLayout;
