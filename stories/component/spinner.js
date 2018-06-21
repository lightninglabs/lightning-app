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
  .add('SmallSpinner', () => <SmallSpinner />)
  .add('LoadNetworkSpinner', () => (
    <Background
      color={color.blackDark}
      style={{ flexDirection: 'row', width: '100%' }}
    >
      <LoadNetworkSpinner percentage={30} msg="Loading network..." />
      <LoadNetworkSpinner percentage={50} msg="Almost done..." />
      <LoadNetworkSpinner percentage={100} msg="Just a few seconds..." />
    </Background>
  ));
