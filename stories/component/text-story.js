import React from 'react';
import { storiesOf } from '../storybook-react';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import {
  Text,
  CopyText,
  H1Text,
  H3Text,
  H4Text,
} from '../../src/component/text';

storiesOf('Text', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
    </Background>
  ))
  .add('Base Text', () => (
    <Text>The quick brown fox jumps over the lazy dog.</Text>
  ))
  .add('Copy Text', () => (
    <CopyText>The quick brown fox jumps over the lazy dog.</CopyText>
  ))
  .add('Heading 1', () => <H1Text>Heading 1</H1Text>)
  .add('Heading 3', () => <H3Text>Heading 3</H3Text>)
  .add('Heading 4', () => <H4Text>Heading 4</H4Text>);
