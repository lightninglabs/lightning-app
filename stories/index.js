import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';

import Button from '../src/components/button';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Button', module)
  .add('with text', () => (
    <Button text="React Native Button" onPress={action('clicked')} />
  ))
  .add('with some emoji', () => (
    <Button text="😀 😎 👍 💯" onPress={action('clicked')} />
  ));
