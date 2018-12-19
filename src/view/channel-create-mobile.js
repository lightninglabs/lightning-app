import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { InputField, AmountInputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, SmallGlasButton, Button } from '../component/button';
import { BalanceLabel, BalanceLabelUnit } from '../component/label';
import Card from '../component/card';
import { FormStretcher, FormSubText } from '../component/form';
import { color } from '../component/style';

const styles = StyleSheet.create({
  balance: {
    marginTop: 15,
  },
  unit: {
    color: color.blackText,
  },
  form: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  subText: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});

const ChannelCreateView = ({ store, nav, channel }) => (
  <Background color={color.blackDark}>
    <Header>
      <Button disabled onPress={() => {}} />
      <Title title="Create Channel" />
      <CancelButton onPress={() => nav.goChannels()} />
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
          <BalanceLabelUnit style={styles.unit}>
            {store.unitFiatLabel}
          </BalanceLabelUnit>
        </BalanceLabel>
        <FormStretcher style={styles.form}>
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
      </Card>
    </MainContent>
    <SmallGlasButton onPress={() => channel.connectAndOpen()}>
      Done
    </SmallGlasButton>
  </Background>
);

ChannelCreateView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
};

export default observer(ChannelCreateView);
