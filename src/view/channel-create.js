import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { InputField, AmountInputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, PillButton, Button } from '../component/button';
import { BalanceLabel, BalanceLabelUnit } from '../component/label';
import Card from '../component/card';
import { FormStretcher, FormSubText } from '../component/form';
import { color } from '../component/style';

const styles = StyleSheet.create({
  balance: {
    marginTop: 40,
  },
  unit: {
    color: color.blackText,
  },
  subText: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  doneBtn: {
    backgroundColor: color.blackDark,
  },
});

const ChannelCreateView = ({ store, nav, channel }) => (
  <Background color={color.blackDark}>
    <Header separator>
      <Button disabled onPress={() => {}} />
      <Title title="Create Channel" />
      <CancelButton onPress={() => nav.goBack()} />
    </Header>
    <MainContent>
      <Card>
        <BalanceLabel style={styles.balance}>
          <AmountInputField
            autoFocus={true}
            value={store.channel.amount}
            onChangeText={amount => channel.setAmount({ amount })}
            onSubmitEditing={() => channel.connectAndOpen()}
          />
          <BalanceLabelUnit style={styles.unit}>{store.unit}</BalanceLabelUnit>
        </BalanceLabel>
        <FormStretcher>
          <InputField
            placeholder="Pubkey@HostIP"
            value={store.channel.pubkeyAtHost}
            onChangeText={pubkeyAtHost =>
              channel.setPubkeyAtHost({ pubkeyAtHost })
            }
            onSubmitEditing={() => channel.connectAndOpen()}
          />
        </FormStretcher>
        <FormSubText style={styles.subText}>
          Add the amount you want in the channel, then the peer you would like
          to connect with.
        </FormSubText>
        <PillButton
          onPress={() => channel.connectAndOpen()}
          style={styles.doneBtn}
        >
          Done
        </PillButton>
      </Card>
    </MainContent>
  </Background>
);

ChannelCreateView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
};

export default observer(ChannelCreateView);
