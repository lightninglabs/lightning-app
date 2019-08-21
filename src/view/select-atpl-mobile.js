import React from 'react';
import { View } from 'react-native';
import { createStyles, maxWidth } from '../component/media-query';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText, Text } from '../component/text';
import { RadioButton, GlasButton } from '../component/button';
import { SettingCopyItem } from '../component/setting';
import { color, font, smallBreakWidth } from '../component/style';

//
// Select Autopilot View
//

const baseStyles = {
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginTop: 80,
    textAlign: 'center',
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 260,
  },
  list: {
    marginTop: 40,
    width: undefined,
    alignSelf: 'stretch',
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    title: {
      fontSize: font.sizeL + 10,
      lineHeight: font.sizeL + 10,
      marginTop: 40,
    },
    list: {
      marginTop: 50,
    },
  })
);

const SelectAutopilotView = ({ store, autopilot, info }) => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>
        Automatically set up channels?
      </CopyOnboardText>
      <Text style={styles.copyTxt}>
        {
          "If you want to avoid manual channel creation, the app can allocate funds to channels for you. It's called autopilot."
        }
      </Text>
      <View style={styles.list}>
        <SettingCopyItem
          name="Use autopilot (recommended)"
          copy="I want the app to create channels and move my funds into those channels automatically."
          onSelect={() => !store.settings.autopilot && autopilot.toggle()}
        >
          <RadioButton selected={store.settings.autopilot === true} />
        </SettingCopyItem>
        <SettingCopyItem
          name="Create channels manually"
          copy="I don't want the app to automatically create channels for me. I can do this all myself."
          onSelect={() => store.settings.autopilot && autopilot.toggle()}
        >
          <RadioButton selected={store.settings.autopilot === false} />
        </SettingCopyItem>
      </View>
    </MainContent>
    <GlasButton onPress={() => info.initLoaderSyncing()}>Save</GlasButton>
  </Background>
);

SelectAutopilotView.propTypes = {
  store: PropTypes.object.isRequired,
  autopilot: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

export default observer(SelectAutopilotView);
