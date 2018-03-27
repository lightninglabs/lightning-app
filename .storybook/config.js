import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import Container from '../src/component/container';

addDecorator(story => <Container>{story()}</Container>);

function loadStories() {
  const context = require.context('../stories', true, /\.js?$/)
  context.keys().forEach(context)
}

configure(loadStories, module);
