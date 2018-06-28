import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { SmallButton, BackButton } from '../component/button';
import { ListContent, List, ListItem, ListHeader } from '../component/list';
import { Alert } from '../component/notification';
import Text from '../component/text';
import Icon from '../component/icon';
import { color, font } from '../component/style';

//
// Channel View
//

const ChannelView = ({ store, nav, channel }) => {
  const {
    computedChannels: channels,
    channelBalanceOpenLabel,
    channelBalancePendingLabel,
    channelBalanceClosingLabel,
    unitLabel,
  } = store;
  return (
    <Background color={color.blackDark}>
      <ChannelHeader
        goChannelCreate={() => channel.initCreate()}
        goBack={() => nav.goBack()}
      />
      <ChannelSummary
        channelBalanceOpenLabel={channelBalanceOpenLabel}
        channelBalancePendingLabel={channelBalancePendingLabel}
        channelBalanceClosingLabel={channelBalanceClosingLabel}
        unitLabel={unitLabel}
      />
      <ListContent>
        <List
          data={channels}
          renderHeader={() => <ChannelListHeader />}
          renderItem={item => (
            <ChannelListItem
              ch={item}
              onSelect={() => channel.select({ item })}
            />
          )}
        />
      </ListContent>
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
  plusIcon: {
    height: 12,
    width: 12,
  },
});

const ChannelHeader = ({ goChannelCreate, goBack }) => (
  <Header separator>
    <View style={headerStyles.btnWrapperLeft}>
      <BackButton onPress={goBack} />
    </View>
    <Title title="Channels" />
    <View style={headerStyles.btnWrapperRight}>
      <SmallButton border text="Add" onPress={goChannelCreate}>
        <Icon image="plus" style={headerStyles.plusIcon} />
      </SmallButton>
    </View>
  </Header>
);

ChannelHeader.propTypes = {
  goChannelCreate: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};

//
// ChannelSummary
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
  channelBalancePendingLabel,
  channelBalanceClosingLabel,
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
  </View>
);

ChannelSummary.propTypes = {
  channelBalanceOpenLabel: PropTypes.string.isRequired,
  channelBalancePendingLabel: PropTypes.string.isRequired,
  channelBalanceClosingLabel: PropTypes.string.isRequired,
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

const statusType = ch =>
  ch.status === 'open'
    ? 'success'
    : ch.status.includes('open')
      ? 'info'
      : 'error';

const ChannelListItem = ({ ch, onSelect }) => (
  <ListItem onSelect={onSelect}>
    <View style={[iStyles.m, iStyles.group]}>
      <Alert type={statusType(ch)} style={iStyles.alert} />
      <Text style={iStyles.txt}>{ch.statusLabel}</Text>
    </View>
    <Text style={[iStyles.m, iStyles.txt]}>{ch.capacityLabel}</Text>
    <View style={iStyles.l}>
      <Text style={[iStyles.txt, iStyles.wrap]} numberOfLines={1}>
        {ch.id}
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
});

const ChannelListHeader = () => (
  <ListHeader>
    <Text style={[iStyles.m, hStyles.txt]}>STATUS</Text>
    <Text style={[iStyles.m, hStyles.txt]}>CAPACITY</Text>
    <Text style={[iStyles.l, hStyles.txt]}>CHANNEL ID</Text>
    <Text style={[iStyles.m, hStyles.txt]}>CAN SEND</Text>
    <Text style={[iStyles.s, hStyles.txt]}>CAN RECEIVE</Text>
  </ListHeader>
);

export default observer(ChannelView);
