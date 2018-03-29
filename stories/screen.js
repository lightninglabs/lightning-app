import React from 'react';
import { storiesOf } from '@storybook/react';
import WelcomeView from '../src/view/welcome';
import HomeView from '../src/view/home';

storiesOf('Screens', module)
  .add('Welcome', () => <WelcomeView />)
  .add('Home', () => <HomeView />);
