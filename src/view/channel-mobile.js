import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import { Header, Title } from '../component/header';
import { BackButton, AddButton } from '../component/button';
import { ListContent, List, CardItem } from '../component/list';
import { Alert } from '../component/notification';
import MainContent from '../component/main-content';
import { ResizeableSpinner } from '../component/spinner';
import { H1Text, CopyText } from '../component/text';
import Text from '../component/text';
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
    <AddButton onPress={goChannelCreate} />
  </Header>
);

ChannelHeader.propTypes = {
  goChannelCreate: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
};

//
// Channel List
//

const ChannelList = ({ store, channel }) => {
  const { computedChannels: channels, unitLabel } = store;
  return (
    <ListContent>
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
    alignItems: 'stretch',
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
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
    fontSize: 9,
    width: 120,
  },
  capacityWrapper: {
    marginTop: 10,
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
    marginRight: 30,
  },
});

const ChannelListItem = ({ ch, unitLabel, onSelect }) => (
  <CardItem style={iStyles.item} onSelect={onSelect}>
    <View style={iStyles.header}>
      <View style={iStyles.status}>
        <Alert type={ch.statusType} />
        <Text style={iStyles.statusTxt}>{ch.statusLabel}</Text>
      </View>
      <Text style={iStyles.fundingTx} numberOfLines={1}>
        {ch.fundingTxId}
      </Text>
    </View>
    <View style={iStyles.capacityWrapper}>
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
  </CardItem>
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
  spinner: {
    height: 190,
  },
  bolt: {
    height: 172 * 0.6,
    width: 95 * 0.6,
  },
  title: {
    textAlign: 'center',
    lineHeight: font.sizeXXL + 5,
    marginTop: 50,
    maxWidth: 250,
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 40,
    maxWidth: 250,
    marginBottom: 40,
  },
};

const noStyles = createStyles(
  baseNoStyles,

  maxWidth(smallBreakWidth, {
    spinner: {
      height: 150,
    },
    bolt: {
      height: 172 * 0.5,
      width: 95 * 0.5,
    },
    title: {
      marginTop: 30,
    },
    copyTxt: {
      marginTop: 20,
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
