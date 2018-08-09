import React from 'react';
import { storiesOf } from '@storybook/react';
import MainContent from '../../src/component/main-content';
import {
  SmallSpinner,
  LoadNetworkSpinner,
  WaitSpinner,
} from '../../src/component/spinner';
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
      <LoadNetworkSpinner
        percentage={0.3}
        msg="Loading network..."
        style={{ margin: 20 }}
      />
      <LoadNetworkSpinner
        percentage={0.5}
        msg="Almost done..."
        style={{ margin: 20 }}
      />
      <LoadNetworkSpinner
        percentage={1}
        msg="Just a few seconds..."
        style={{ margin: 20 }}
      />
    </MainContent>
  ))
  .add('Wait Spinner', () => (
    <MainContent style={{ justifyContent: 'center' }}>
      <WaitSpinner msg="Loading network" />
    </MainContent>
  ));
