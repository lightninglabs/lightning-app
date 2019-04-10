import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { SmallButton, BackButton } from '../component/button';
import { ListContent, List, ListItem, ListHeader } from '../component/list';
import { Alert } from '../component/notification';
import MainContent from '../component/main-content';
import { ResizeableSpinner } from '../component/spinner';
import { H1Text, CopyText } from '../component/text';
import Text from '../component/text';
import PlusIcon from '../../src/asset/icon/plus';
import BitcoinIcon from '../../src/asset/icon/bitcoin';
import LightningBoltGradientIcon from '../../src/asset/icon/lightning-bolt-gradient';
import { color, font } from '../component/style';

//
// Channel View
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

const headerStyles = StyleSheet.create({
  btnWrapperLeft: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  btnWrapperRight: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 24,
  },
});

const ChannelHeader = ({ goChannelCreate, goHome }) => (
  <Header separator>
    <View style={headerStyles.btnWrapperLeft}>
      <BackButton onPress={goHome} />
    </View>
    <Title title="Channels" />
    <View style={headerStyles.btnWrapperRight}>
      <SmallButton border text="Add" onPress={goChannelCreate}>
        <PlusIcon height={12} width={12} />
      </SmallButton>
    </View>
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
});

const ChannelList = ({ store, channel }) => {
  const {
    computedChannels: channels,
    channelBalanceOpenLabel,
    channelBalanceInactiveLabel,
    channelBalancePendingLabel,
    channelBalanceClosingLabel,
    balanceLabel,
    unitLabel,
  } = store;
  return (
    <View style={listStyles.wrapper}>
      <ChannelSummary
        channelBalanceOpenLabel={channelBalanceOpenLabel}
        channelBalanceInactiveLabel={channelBalanceInactiveLabel}
        channelBalancePendingLabel={channelBalancePendingLabel}
        channelBalanceClosingLabel={channelBalanceClosingLabel}
        balanceLabel={balanceLabel}
        unitLabel={unitLabel}
      />
      <ListContent>
        <List
          data={channels}
          renderHeader={ChannelListHeader}
          renderItem={item => (
            <ChannelListItem
              ch={item}
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
// Channel Summary
//

const summaryStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 20,
    backgroundColor: color.glasDarker,
    borderRadius: 5,
  },
  alert: {
    marginRight: 10,
  },
  txt: {
    fontSize: font.sizeXS,
    lineHeight: font.lineHeightXS,
  },
  total: {
    marginLeft: 30,
  },
});

const ChannelSummary = ({
  channelBalanceOpenLabel,
  channelBalanceInactiveLabel,
  channelBalancePendingLabel,
  channelBalanceClosingLabel,
  balanceLabel,
  unitLabel,
}) => (
  <View style={summaryStyles.wrapper}>
    <View style={summaryStyles.box}>
      <Alert type="success" style={summaryStyles.alert} />
      <Text style={summaryStyles.txt}>Opened</Text>
      <Text style={[summaryStyles.txt, summaryStyles.total]}>
        {channelBalanceOpenLabel} {unitLabel}
      </Text>
    </View>
    <View style={summaryStyles.box}>
      <Alert type="inactive" style={summaryStyles.alert} />
      <Text style={summaryStyles.txt}>Inactive</Text>
      <Text style={[summaryStyles.txt, summaryStyles.total]}>
        {channelBalanceInactiveLabel} {unitLabel}
      </Text>
    </View>
    <View style={summaryStyles.box}>
      <Alert type="info" style={summaryStyles.alert} />
      <Text style={summaryStyles.txt}>Pending</Text>
      <Text style={[summaryStyles.txt, summaryStyles.total]}>
        {channelBalancePendingLabel} {unitLabel}
      </Text>
    </View>
    <View style={summaryStyles.box}>
      <Alert type="error" style={summaryStyles.alert} />
      <Text style={summaryStyles.txt}>Closing</Text>
      <Text style={[summaryStyles.txt, summaryStyles.total]}>
        {channelBalanceClosingLabel} {unitLabel}
      </Text>
    </View>
    <View style={summaryStyles.box}>
      <View style={summaryStyles.alert}>
        <BitcoinIcon height={170 * 0.06} width={135 * 0.06} />
      </View>
      <Text style={summaryStyles.txt}>On-chain</Text>
      <Text style={[summaryStyles.txt, summaryStyles.total]}>
        {balanceLabel} {unitLabel}
      </Text>
    </View>
  </View>
);

ChannelSummary.propTypes = {
  channelBalanceOpenLabel: PropTypes.string.isRequired,
  channelBalanceInactiveLabel: PropTypes.string.isRequired,
  channelBalancePendingLabel: PropTypes.string.isRequired,
  channelBalanceClosingLabel: PropTypes.string.isRequired,
  balanceLabel: PropTypes.string.isRequired,
  unitLabel: PropTypes.string,
};

//
// Channel List Item
//

const iStyles = StyleSheet.create({
  wrap: {
    paddingRight: 50,
  },
  txt: {
    color: color.white,
    fontSize: font.sizeS,
  },
  alert: {
    marginRight: 6,
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  l: { flex: 6 },
  m: { flex: 4 },
  s: { flex: 2 },
  i: { flex: 1 },
});

const ChannelListItem = ({ ch, onSelect }) => (
  <ListItem onSelect={onSelect}>
    <View style={[iStyles.m, iStyles.group]}>
      <Alert type={ch.statusType} style={iStyles.alert} />
      <Text style={iStyles.txt}>{ch.statusLabel}</Text>
    </View>
    <Text style={[iStyles.m, iStyles.txt]}>{ch.capacityLabel}</Text>
    <View style={iStyles.l}>
      <Text style={[iStyles.txt, iStyles.wrap]} numberOfLines={1}>
        {ch.fundingTxId}
      </Text>
    </View>
    <Text style={[iStyles.m, iStyles.txt]}>{ch.localBalanceLabel}</Text>
    <Text style={[iStyles.s, iStyles.txt]}>{ch.remoteBalanceLabel}</Text>
  </ListItem>
);

ChannelListItem.propTypes = {
  ch: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

//
// Channel List Header
//

const hStyles = StyleSheet.create({
  txt: {
    color: color.greyListHeader,
    fontSize: font.sizeXS,
  },
  header: {
    backgroundColor: color.blackDark,
  },
});

const ChannelListHeader = () => (
  <ListHeader style={hStyles.header}>
    <Text style={[iStyles.m, hStyles.txt]}>STATUS</Text>
    <Text style={[iStyles.m, hStyles.txt]}>CAPACITY</Text>
    <Text style={[iStyles.l, hStyles.txt]}>FUNDING TRANSACTION ID</Text>
    <Text style={[iStyles.m, hStyles.txt]}>CAN SEND</Text>
    <Text style={[iStyles.s, hStyles.txt]}>CAN RECEIVE</Text>
  </ListHeader>
);

//
// No Channel
//

const noStyles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  title: {
    marginTop: 40,
  },
  copyTxt: {
    textAlign: 'center',
  },
});

const NoChannel = () => (
  <MainContent style={noStyles.content}>
    <ResizeableSpinner
      percentage={1}
      size={190}
      progressWidth={6}
      gradient="openChannelsGrad"
    >
      <LightningBoltGradientIcon height={172 * 0.6} width={95 * 0.6} />
    </ResizeableSpinner>
    <H1Text style={noStyles.title}>Opening Channels</H1Text>
    <CopyText style={noStyles.copyTxt}>
      {
        'The autopilot feature will open channels for you, but\nyou can add your own at any time.'
      }
    </CopyText>
  </MainContent>
);

export default observer(ChannelView);
