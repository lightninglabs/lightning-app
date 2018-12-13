import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { SmallButton, BackButton } from '../component/button';
import { ListContent, List, ListItem } from '../component/list';
import { Alert } from '../component/notification';
import MainContent from '../component/main-content';
import { ResizeableSpinner } from '../component/spinner';
import { H1Text, CopyText } from '../component/text';
import Text from '../component/text';
import PlusIcon from '../../src/asset/icon/plus';
import LightningBoltGradientIcon from '../../src/asset/icon/lightning-bolt-gradient';
import { color, font, smallBreakWidth } from '../component/style';

//
// Channel View (Mobile)
//

const ChannelView = ({ store, nav, channel }) => {
  const { computedChannels: channels } = store;
  return (
    <Background color={color.blackDark}>
      <ChannelHeader
        goChannelCreate={() => channel.initCreate()}
        goHome={() => nav.goHome()}
      />
      {channels.length ? (
        <ChannelList store={store} channel={channel} />
      ) : (
        <NoChannel />
      )}
    </Background>
  );
};

ChannelView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
};

//
// Channel Header
//

const ChannelHeader = ({ goChannelCreate, goHome }) => (
  <Header>
    <BackButton onPress={goHome} />
    <Title title="Channels" />
    <SmallButton onPress={goChannelCreate}>
      <PlusIcon height={14} width={14} />
    </SmallButton>
  </Header>
);

ChannelHeader.propTypes = {
  goChannelCreate: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
};

//
// Channel List
//

const listStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const ChannelList = ({ store, channel }) => {
  const { computedChannels: channels, unitLabel } = store;
  return (
    <View style={listStyles.wrapper}>
      <ListContent style={listStyles.list}>
        <List
          data={channels}
          renderItem={item => (
            <ChannelListItem
              ch={item}
              unitLabel={unitLabel}
              onSelect={() => channel.select({ item })}
            />
          )}
        />
      </ListContent>
    </View>
  );
};

ChannelList.propTypes = {
  store: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
};

//
// Channel List Item
//

const iStyles = StyleSheet.create({
  item: {
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 180,
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: color.glasDarker,
    borderBottomWidth: 0,
    borderRadius: 7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.greyBorder,
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  statusTxt: {
    fontSize: font.sizeSub,
    marginLeft: 6,
  },
  fundingTx: {
    color: color.white,
    fontSize: 9,
    width: 120,
  },
  label: {
    color: color.greyListHeader,
    fontSize: font.sizeXS,
  },
  capacity: {
    marginTop: 5,
    fontSize: font.sizeL + 6,
    lineHeight: font.lineHeightL + 2,
  },
  balanceWrapper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  balanceField: {
    flex: 1,
  },
});

const statusType = ch =>
  ch.status === 'open'
    ? 'success'
    : ch.status.includes('open')
      ? 'info'
      : 'error';

const ChannelListItem = ({ ch, unitLabel, onSelect }) => (
  <ListItem style={iStyles.item} onSelect={onSelect}>
    <View style={iStyles.header}>
      <View style={iStyles.status}>
        <Alert type={statusType(ch)} />
        <Text style={iStyles.statusTxt}>{ch.statusLabel}</Text>
      </View>
      <Text style={iStyles.fundingTx} numberOfLines={1}>
        {ch.fundingTxId}
      </Text>
    </View>
    <View>
      <Text style={iStyles.label}>CAPACITY</Text>
      <Text style={iStyles.capacity}>
        {ch.capacityLabel} {unitLabel}
      </Text>
    </View>
    <View style={iStyles.balanceWrapper}>
      <View style={iStyles.balanceField}>
        <Text style={iStyles.label}>CAN SEND</Text>
        <Text>{ch.localBalanceLabel}</Text>
      </View>
      <View style={iStyles.balanceField}>
        <Text style={iStyles.label}>CAN RECEIVE</Text>
        <Text>{ch.remoteBalanceLabel}</Text>
      </View>
    </View>
  </ListItem>
);

ChannelListItem.propTypes = {
  ch: PropTypes.object.isRequired,
  unitLabel: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

//
// No Channel (Mobile)
//

const baseNoStyles = {
  content: {
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    lineHeight: font.sizeXXL + 5,
    marginTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
  },
  copyTxt: {
    textAlign: 'center',
    padding: 30,
  },
  spinner: {
    height: 190,
  },
  bolt: {
    height: 172 * 0.6,
    width: 95 * 0.6,
  },
};

const noStyles = createStyles(
  baseNoStyles,

  maxWidth(smallBreakWidth, {
    spinner: {
      height: 150,
    },
    bolt: {
      height: 90,
      width: 50,
    },
  })
);

const NoChannel = () => (
  <MainContent style={noStyles.content}>
    <ResizeableSpinner
      percentage={1}
      size={noStyles.spinner.height}
      progressWidth={6}
      gradient="openChannelsGrad"
    >
      <LightningBoltGradientIcon
        height={noStyles.bolt.height}
        width={noStyles.bolt.width}
      />
    </ResizeableSpinner>
    <H1Text style={noStyles.title}>Opening Channels</H1Text>
    <CopyText style={noStyles.copyTxt}>
      {
        'The autopilot feature will open channels for you, but you can add your own at any time.'
      }
    </CopyText>
  </MainContent>
);

export default observer(ChannelView);
