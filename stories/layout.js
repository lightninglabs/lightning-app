import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Background from '../src/component/background';
import MainContent from '../src/component/main-content';
import { Header, Title } from '../src/component/header';
import {
  GlasButton,
  PillButton,
  BackButton,
  CancelButton,
} from '../src/component/button';
import { BalanceLabel, BalanceLabelNumeral } from '../src/component/label';
import Card from '../src/component/card';
import Text from '../src/component/text';
import Icon from '../src/component/icon';
import { colors } from '../src/component/style';

storiesOf('Layout', module)
  .add('Button Bottom', () => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>
        <BalanceLabel>
          <BalanceLabelNumeral>$10,000.00</BalanceLabelNumeral>
        </BalanceLabel>
      </MainContent>
      <GlasButton onPress={action('clicked')}>Continue</GlasButton>
    </Background>
  ))
  .add('Card Form', () => (
    <Background image="purple-gradient-bg">
      <Header shadow color={colors.purple}>
        <BackButton onPress={action('back')} />
        <Title title="Lightning Payment">
          <Icon image="lightning-bolt" style={{ height: 12, width: 6.1 }} />
        </Title>
        <CancelButton onPress={action('cancel')} />
      </Header>
      <MainContent>
        <Card>
          <Text style={{ color: colors.blackText, paddingBottom: 40 }}>
            {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non ultricies est. Ut ut egestas tellus. Duis hendrerit accumsan turpis, nec lacinia leo pharetra sed. Praesent finibus volutpat velit. Vestibulum eget ultrices orci. Aenean iaculis porta pretium. Maecenas placerat, nibh id ultricies hendrerit, arcu turpis bibendum metus, eget pharetra urna dui quis risus. Vivamus rhoncus interdum massa eu ornare. Integer egestas metus ut mi mollis venenatis. Vestibulum non ultrices velit. Nulla dapibus purus id egestas pellentesque. Proin pretium elit mattis neque hendrerit, sed placerat arcu ultrices. Aliquam erat volutpat.

            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices aliquet mauris nec pulvinar. Suspendisse ornare, ligula in elementum egestas, eros dolor porta leo, sed iaculis massa augue vitae quam. Pellentesque at nulla maximus, molestie odio bibendum, eleifend justo. Vestibulum vel interdum nisi, et blandit dolor. Praesent mattis sapien in orci lobortis, in dapibus sem porta. Etiam imperdiet massa in felis sollicitudin vulputate. Nullam in dignissim mauris. Etiam consequat tortor in dictum mollis. Ut nec egestas nunc. Cras ex velit, pellentesque in ligula sed, bibendum laoreet mauris. Integer sit amet ligula vitae purus sodales porta.

            Quisque nec laoreet nulla. Maecenas ullamcorper velit est. Phasellus efficitur, nisi in sodales tincidunt, ex ligula dictum dolor, sit amet eleifend sapien velit eget quam. Praesent dolor nisi, dignissim a nunc egestas, elementum scelerisque velit. Donec at turpis eros. Pellentesque id laoreet nibh. Proin et nulla lorem. Vestibulum fringilla auctor augue, ut imperdiet lectus dictum vel. Nullam at magna massa. Suspendisse vitae ipsum nec mauris pellentesque ullamcorper. Curabitur semper suscipit pharetra. Vestibulum id bibendum tellus.`}
          </Text>
          <PillButton onPress={action('clicked')}>Next</PillButton>
        </Card>
      </MainContent>
    </Background>
  ));
