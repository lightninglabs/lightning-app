import React from 'react';
import { storiesOf } from '../storybook-react';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import QRCode from '../../src/component/qrcode';

storiesOf('QR Code', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
    </Background>
  ))
  .add('QR Code', () => <QRCode>{'https://lightning.engineering'}</QRCode>)
  .add('QR Code (sized)', () => (
    <QRCode size={100}>{'https://lightning.engineering'}</QRCode>
  ));
