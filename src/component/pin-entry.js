import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Text from './text';
import Button from './button';
import BackspaceIcon from '../asset/icon/backspace';
import { color } from './style';

//
// Pin Entry
//

const pinEntryStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const PinBubbles = ({ pin, style }) => (
  <View style={[pinEntryStyles.wrapper, style]}>
    <PinBubble char={pin[0]} />
    <PinBubble char={pin[1]} />
    <PinBubble char={pin[2]} />
    <PinBubble char={pin[3]} />
    <PinBubble char={pin[4]} />
    <PinBubble char={pin[5]} />
  </View>
);

PinBubbles.propTypes = {
  pin: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

//
// Pin Bubble
//

const bubbleStyles = StyleSheet.create({
  bubble: {
    margin: 4,
    height: 20,
    width: 20,
    backgroundColor: color.whiteBg,
    opacity: 0.33,
    borderRadius: 15,
  },
  filled: {
    margin: 2,
    height: 24,
    width: 24,
    opacity: 0.92,
    borderColor: color.purple,
    borderStyle: 'solid',
    borderWidth: 4,
  },
});

const PinBubble = ({ char }) => (
  <View style={[bubbleStyles.bubble, char ? bubbleStyles.filled : null]} />
);

PinBubble.propTypes = {
  char: PropTypes.string,
};

//
// Pin Keyboard
//

const keyboardStyles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export const PinKeyboard = ({ onInput, onBackspace, onHelp }) => (
  <View style={keyboardStyles.wrapper}>
    <View style={keyboardStyles.column}>
      <View style={keyboardStyles.row}>
        <PinKey onPress={onInput} num="1" />
        <PinKey onPress={onInput} num="2" label="ABC" />
        <PinKey onPress={onInput} num="3" label="DEF" />
      </View>
      <View style={keyboardStyles.row}>
        <PinKey onPress={onInput} num="4" label="GHI" />
        <PinKey onPress={onInput} num="5" label="JKL" />
        <PinKey onPress={onInput} num="6" label="MNO" />
      </View>
      <View style={keyboardStyles.row}>
        <PinKey onPress={onInput} num="7" label="PQRS" />
        <PinKey onPress={onInput} num="8" label="TUV" />
        <PinKey onPress={onInput} num="9" label="WXYZ" />
      </View>
      <View style={keyboardStyles.row}>
        {onHelp ? <HelpKey onPress={onHelp} /> : <PinKey onPress={() => {}} />}
        <PinKey onPress={onInput} num="0" />
        <BackspaceKey onPress={onBackspace} />
      </View>
    </View>
  </View>
);

PinKeyboard.propTypes = {
  onInput: PropTypes.func.isRequired,
  onBackspace: PropTypes.func.isRequired,
  onHelp: PropTypes.func,
};

//
// Pin Key
//

const keyStyles = StyleSheet.create({
  btn: {
    flex: 1,
    paddingTop: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'SF Pro Display Regular',
    color: color.whiteBg,
    fontSize: 24,
    lineHeight: 24,
  },
  label: {
    fontFamily: 'SF Pro Text Bold',
    color: color.whiteBg,
    fontSize: 10,
    lineHeight: 10,
  },
});

const PinKey = ({ num, label, onPress }) => (
  <Button onPress={() => onPress(num)} style={keyStyles.btn}>
    <Text style={keyStyles.text}>{num}</Text>
    <Text style={keyStyles.label}>{label}</Text>
  </Button>
);

PinKey.propTypes = {
  num: PropTypes.string,
  label: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

//
// Backspace Key
//

const backStyles = StyleSheet.create({
  btn: {
    paddingTop: 15,
    paddingLeft: 5,
  },
});

const BackspaceKey = ({ onPress }) => (
  <Button onPress={onPress} style={[keyStyles.btn, backStyles.btn]}>
    <BackspaceIcon height={19 * 0.8} width={24 * 0.8} />
  </Button>
);

BackspaceKey.propTypes = {
  onPress: PropTypes.func.isRequired,
};

//
// Help Key
//

const helpStyles = StyleSheet.create({
  txt: {
    fontFamily: 'SF Pro Text Bold',
    color: color.whiteBg,
    fontSize: 14,
  },
});

const HelpKey = ({ onPress }) => (
  <Button onPress={onPress} style={keyStyles.btn}>
    <Text style={helpStyles.txt}>Help</Text>
  </Button>
);

HelpKey.propTypes = {
  onPress: PropTypes.func.isRequired,
};
