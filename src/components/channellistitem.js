import React from 'react';
import { View } from 'react-native';
import { Text } from './text';
import Separator from './separator';
import { colors, layout, typography } from '../styles';

const ChannelListItem = ({
  id,
  capacity,
  localBalance,
  remoteBalance,
  active,
  status,
}) => {
  const getColor = color => {
    const pending =
      status === 'pending-open' ||
      status === 'pending-closing' ||
      status === 'pending-force-closing';
    return pending ? colors.lightgray : color;
  };

  const title = {
    open: `CID: ${id}`,
    'pending-open': 'OPENING',
    'pending-closing': 'CLOSING',
    'pending-force-closing': 'CLOSING',
  }[status];

  const Title = () => (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Text style={{ color: getColor(colors.black), fontSize: 20 }}>{title}</Text>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        {active ? <Text style={{ color: getColor(colors.blue) }}>ACTIVE</Text> : null}
        <Text style={{ marginLeft: 10, color: getColor(colors.gray) }}>
          {status && status.toUpperCase()}
        </Text>
      </View>
    </View>
  );

  const Balance = () => (
    <View style={{ flex: 1, flexDirection: 'row', marginTop: 6, marginBottom: 10 }}>
      <Text style={{ color: getColor(colors.blue) }}>My Balance: {localBalance}</Text>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ color: getColor(colors.black) }}>
          Available to Receive: {remoteBalance}
        </Text>
      </View>
    </View>
  );

  const PercentBar = () => (
    <View style={{ flex: 1, flexDirection: 'row', height: 12 }}>
      <View style={{ backgroundColor: getColor(colors.blue), width: `${localBalance / capacity * 100}%` }} />
      <View style={{ flexGrow: 1, backgroundColor: getColor(colors.lightergray) }} />
    </View>
  );

  return (
    <View>
      <Title />
      <Balance />
      <PercentBar />
      <Separator />
    </View>
  );
};

export default ChannelListItem;
