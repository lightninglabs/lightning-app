import React from 'react';
import { storiesOf } from '@storybook/react';
import MainContent from '../../src/component/main-content';
import { LoadNetworkSpinner, SmallSpinner } from '../../src/component/spinner';
import { color } from '../../src/component/style';
import Background from '../../src/component/background';

storiesOf('Spinner', module)
  .addDecorator(story => (
    <Background color={color.blackDark} style={{ justifyContent: 'center' }}>
      {story()}
    </Background>
  ))
  .add('SmallSpinner', () => <SmallSpinner />)
  .add('LoadNetworkSpinner', () => (
    <MainContent style={{ flexDirection: 'row' }}>
      <LoadNetworkSpinner percentage={30} msg="Loading network..." />
      <LoadNetworkSpinner percentage={50} msg="Almost done..." />
      <LoadNetworkSpinner percentage={100} msg="Just a few seconds..." />
    </MainContent>
  ));
