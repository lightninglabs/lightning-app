import React from 'react';
import { View } from 'react-native';
import { Text } from './text';
import Seperator from './seperator';
import { colors } from '../styles';

const ChannelListItem = ({
  id,
  capacity,
  localBalance,
  remoteBalance,
  active,
  status
}) => (
  <View>
    <Title id={id} status={status} active={active} />
    <Balance localBalance={localBalance} remoteBalance={remoteBalance} />
    <PercentBar localBalance={localBalance} capacity={capacity} />
    <Seperator />
  </View>
);

const Title = ({id, status, active}) => (
  <View style={{flex: 1, flexDirection: 'row'}}>
    <Text style={{color: colors.black, fontSize: 20}}>{
      {
        'open': `CID: ${ id }`,
        'pending-open': 'OPENING',
        'pending-closing': 'CLOSING',
        'pending-force-closing': 'CLOSING',
      }[status]
    }</Text>
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', textTransform: 'uppercase'}}>
      {active ? (<Text style={{color: colors.blue}}>active</Text>) : null}
      <Text style={{marginLeft: 10, color: colors.gray}}>{status}</Text>
    </View>
  </View>
)

const Balance = ({localBalance, remoteBalance}) => (
  <View style={{flex: 1, flexDirection: 'row', marginTop: 6, marginBottom: 10}}>
    <Text style={{color: colors.blue}}>My Balance: {localBalance}</Text>
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
      <Text style={{color: colors.black}}>Available to Receive: {remoteBalance}</Text>
    </View>
  </View>
)

const PercentBar = ({localBalance, capacity}) => (
  <View style={{flex: 1, flexDirection: 'row', height: 12}}>
    <View style={{backgroundColor: colors.blue, width: `${(localBalance / capacity) * 100}%`}}></View>
    <View style={{flexGrow: 1, backgroundColor: colors.lightergray}}></View>
  </View>
)

export default ChannelListItem;
