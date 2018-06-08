import React from 'react';
import { storiesOf } from '@storybook/react';
import MainContent from '../../src/component/main-content';
import { SmallSpinner } from '../../src/component/spinner';

storiesOf('Spinner', module)
  .addDecorator(story => (
    <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
  ))
  .add('SmallSpinner', () => <SmallSpinner />);
