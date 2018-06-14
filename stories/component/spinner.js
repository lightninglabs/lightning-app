import React from 'react';
import { storiesOf } from '@storybook/react';
import MainContent from '../../src/component/main-content';
import { TimedSpinner, SmallSpinner } from '../../src/component/spinner';

storiesOf('Spinner', module)
  .addDecorator(story => (
    <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
  ))
  .add('SmallSpinner', () => <SmallSpinner />)
  .add('TimedSpinner', () => <TimedSpinner size={120} percent={90} />);
