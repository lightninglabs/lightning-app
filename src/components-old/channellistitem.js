import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from './text';
import Separator from './separator';
import { colors, layout } from './styles';

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

  const styles = {
    id: {
      color: getColor(colors.black),
      fontSize: 20,
    },
    active: {
      color: getColor(colors.blue),
    },
    status: {
      marginLeft: 10,
      color: getColor(colors.gray),
    },
    balance: {
      marginTop: 6,
      marginBottom: 10,
    },
    local: {
      color: getColor(colors.blue),
    },
    remote: {
      color: getColor(colors.black),
    },
    percentBar: {
      height: 12,
    },
    percent: {
      backgroundColor: getColor(colors.blue),
      width: `${localBalance / capacity * 100}%`,
    },
    bar: {
      backgroundColor: getColor(colors.lightergray),
    },
  };

  const title = {
    open: `CID: ${id}`,
    'pending-open': 'OPENING',
    'pending-closing': 'CLOSING',
    'pending-force-closing': 'CLOSING',
  }[status];

  const Title = () => (
    <View style={layout.flexRow}>
      <Text style={styles.id}>{title}</Text>
      <View style={[layout.flexRow, layout.flexEnd]}>
        {active ? <Text style={styles.active}>ACTIVE</Text> : null}
        <Text style={styles.status}>{status && status.toUpperCase()}</Text>
      </View>
    </View>
  );

  const Balance = () => (
    <View style={[layout.flexRow, styles.balance]}>
      <Text style={styles.local}>My Balance: {localBalance}</Text>
      <View style={[layout.flexRow, layout.flexEnd]}>
        <Text style={styles.remote}>Available to Receive: {remoteBalance}</Text>
      </View>
    </View>
  );

  const PercentBar = () => (
    <View style={[layout.flexRow, styles.percentBar]}>
      <View style={styles.percent} />
      <View style={[layout.flexGrow, styles.bar]} />
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

ChannelListItem.propTypes = {
  id: PropTypes.string,
  capacity: PropTypes.string,
  localBalance: PropTypes.string,
  remoteBalance: PropTypes.string,
  active: PropTypes.bool,
  status: PropTypes.string,
};

export default ChannelListItem;
