import React from 'react';
import { View } from 'react-native';
import { Text } from './text';
import Seperator from './seperator';
import { colors, layout, typography } from '../styles';

const ChannelListItem = ({
  id,
  capacity,
  localBalance,
  remoteBalance,
  active,
  status
}) => {
  const getColor = color => {
    const pending = status !== 'open';
    return pending ? colors.lightgray : color;
  };

  const styles = {
    id: {
      color: getColor(colors.black),
      fontSize: 20
    },
    active: {
      color: getColor(colors.blue)
    },
    status: {
      marginLeft: 10,
      color: getColor(colors.gray)
    },
    balance: {
      marginTop: 6,
      marginBottom: 10
    },
    local: {
      color: getColor(colors.blue)
    },
    remote: {
      color: getColor(colors.black)
    },
    percentBar: {
      height: 12
    },
    percent: {
      backgroundColor: getColor(colors.blue),
      width: `${(localBalance / capacity) * 100}%`
    },
    bar: {
      backgroundColor: getColor(colors.lightergray)
    }
  };

  const title = {
    'open': `CID: ${id}`,
    'pending-open': 'OPENING',
    'pending-closing': 'CLOSING',
    'pending-force-closing': 'CLOSING',
  }[status]

  const Title = ({id, status, active}) => (
    <View style={layout.flexRow}>
      <Text style={styles.id}>{title}</Text>
      <View style={[layout.flexRow, layout.flexEnd, typography.uppercase]}>
        {active ? (<Text style={styles.active}>active</Text>) : null}
        <Text style={styles.status}>{status}</Text>
      </View>
    </View>
  );

  const Balance = ({localBalance, remoteBalance}) => (
    <View style={[layout.flexRow, styles.balance]}>
      <Text style={styles.local}>My Balance: {localBalance}</Text>
      <View style={[layout.flexRow, layout.flexEnd]}>
        <Text style={styles.remote}>Available to Receive: {remoteBalance}</Text>
      </View>
    </View>
  );

  const PercentBar = ({localBalance, capacity}) => (
    <View style={[layout.flexRow, styles.percentBar]}>
      <View style={styles.percent}></View>
      <View style={[layout.flexGrow, styles.bar]}></View>
    </View>
  );

  return (
    <View>
      <Title id={id} status={status} active={active} />
      <Balance localBalance={localBalance} remoteBalance={remoteBalance} />
      <PercentBar localBalance={localBalance} capacity={capacity} />
      <Seperator />
    </View>
  );
};

export default ChannelListItem;
