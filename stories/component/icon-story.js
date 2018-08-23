import React from 'react';
import { storiesOf } from '../storybook-react';
import Background from '../../src/component/background';
import MainContent from '../../src/component/main-content';
import BackIcon from '../../src/asset/icon/back';
import PlusIcon from '../../src/asset/icon/plus';
import CancelIcon from '../../src/asset/icon/cancel';
import ArrowDownIcon from '../../src/asset/icon/arrow-down';
import LightningBoltIcon from '../../src/asset/icon/lightning-bolt';
import QrIcon from '../../src/asset/icon/qr';
import SettingsIcon from '../../src/asset/icon/settings';

storiesOf('Icons', module)
  .addDecorator(story => (
    <Background image="purple-gradient-bg">
      <MainContent style={{ justifyContent: 'center' }}>{story()}</MainContent>
    </Background>
  ))
  .add('Back', () => <BackIcon height={20} width={12} />)
  .add('Plus', () => <PlusIcon height={21} width={21} />)
  .add('Cancel', () => <CancelIcon height={21} width={21} />)
  .add('Arrow Down', () => <ArrowDownIcon height={9} width={23} />)
  .add('Lightning Bolt', () => <LightningBoltIcon height={126} width={64} />)
  .add('QR Code', () => <QrIcon height={39} width={40} />)
  .add('Settings', () => <SettingsIcon height={21} width={20} />);
