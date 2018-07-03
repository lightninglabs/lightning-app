import React from 'react';
import { storiesOf } from '@storybook/react';
import MainContent from '../../src/component/main-content';
import { LoadNetworkSpinner, SmallSpinner } from '../../src/component/spinner';
import { color } from '../../src/component/style';
import Background from '../../src/component/background';

storiesOf('Spinner', module)
  .addDecorator(story => (
    <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
  ))
  .add('SmallSpinner', () => <SmallSpinner />);

storiesOf('Spinner', module)
  .addDecorator(story => (
    <Background color={color.blackDark}>{story()}</Background>
  ))
  .add('LoadNetworkSpinner', () => (
    <MainContent style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
      <LoadNetworkSpinner percentage={30} msg="Loading network..." />
      <LoadNetworkSpinner percentage={50} msg="Almost done..." />
      <LoadNetworkSpinner percentage={100} msg="Just a few seconds..." />
    </MainContent>
  ));
