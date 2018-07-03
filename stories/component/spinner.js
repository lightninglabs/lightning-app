import React from 'react';
import { storiesOf } from '@storybook/react';
import MainContent from '../../src/component/main-content';
import { SmallSpinner } from '../../src/component/spinner';
import { LoadNetworkSpinner } from '../../src/view/loader-syncing';
import { color } from '../../src/component/style';
import Background from '../../src/component/background';

storiesOf('Spinner', module)
  .addDecorator(story => (
    <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
  ))
  .add('Small Spinner', () => <SmallSpinner />);

storiesOf('Spinner', module)
  .addDecorator(story => (
    <Background color={color.blackDark}>{story()}</Background>
  ))
  .add('Load Network Spinner', () => (
    <MainContent style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
      <LoadNetworkSpinner percentage={30} msg="Loading network..." />
      <LoadNetworkSpinner percentage={50} msg="Almost done..." />
      <LoadNetworkSpinner percentage={100} msg="Just a few seconds..." />
    </MainContent>
  ));
