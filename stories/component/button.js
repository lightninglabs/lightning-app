import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import {
  Button,
  GlasButton,
  PillButton,
  SmallButton,
} from '../../src/component/button';
import Icon from '../../src/component/icon';
import { colors } from '../../src/component/style';

storiesOf('Button', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">{story()}</Background>
  ))
  .add('Glas Button', () => (
    <GlasButton onPress={action('clicked')}>Glas Button</GlasButton>
  ))
  .add('Glas Disabled', () => (
    <GlasButton disabled onPress={action('clicked')}>
      Glas Disabled
    </GlasButton>
  ));

storiesOf('Button', module)
  .add('Pill', () => (
    <PillButton onPress={action('clicked')}>Pill Button</PillButton>
  ))
  .add('Pill Disabled', () => (
    <PillButton disabled onPress={action('clicked')}>
      Pill Disabled
    </PillButton>
  ))
  .add('Pill Orange', () => (
    <PillButton
      style={{ backgroundColor: colors.orange }}
      onPress={action('clicked')}
    >
      Pill Button
    </PillButton>
  ));

storiesOf('Button', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
    </Background>
  ))
  .add('Small Button', () => (
    <SmallButton border text="Small Button" onPress={action('clicked')} />
  ))
  .add('Small Icon Button', () => (
    <SmallButton border text="Small Icon" onPress={action('clicked')}>
      <Icon image="cancel" style={{ height: 12, width: 12 }} />
    </SmallButton>
  ))
  .add('Icon Button', () => (
    <Button onPress={action('clicked')}>
      <Icon image="cancel" style={{ height: 14, width: 14 }} />
    </Button>
  ))
  .add('Icon Disabled', () => (
    <Button disabled onPress={action('clicked')}>
      <Icon image="cancel" style={{ height: 14, width: 14 }} />
    </Button>
  ));
