import React from 'react';
import { KeyboardAvoidingView, Dimensions } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { createStyles, maxWidth } from '../component/media-query';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { InputField, AmountInputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, GlasButton, Button } from '../component/button';
import { BalanceLabel, BalanceLabelUnit } from '../component/label';
import Card from '../component/card';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import { FormStretcher, FormSubText } from '../component/form';
import { color, font, smallBreakWidth } from '../component/style';

const baseStyles = {
  contentWrapper: {
    flex: 1,
  },
  amountInput: {},
  unit: {
    color: color.blackText,
  },
  form: {},
  input: {
    lineHeight: font.lineHeightM + 5,
  },
  subText: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  nextBtn: {
    backgroundColor: color.purple,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    amountInput: {
      lineHeight: 45,
      height: 45,
      fontSize: font.sizeXXL,
    },
    unit: {
      lineHeight: 45,
      marginLeft: 5,
      paddingRight: 25,
      paddingBottom: 10,
    },
    form: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    subText: {
      paddingTop: 10,
      paddingBottom: 10,
    },
  })
);

const InvoiceView = ({ store, nav, invoice }) => (
  <Background image="purple-gradient-bg">
    <Header shadow color={color.purple}>
      <Button disabled onPress={() => {}} />
      <Title title="Payment Request">
        <LightningBoltIcon height={12} width={6.1} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    <KeyboardAvoidingView style={styles.contentWrapper} behavior="padding">
      <MainContent>
        <Card style={styles.card}>
          <BalanceLabel style={styles.balance}>
            <AmountInputField
              style={styles.amountInput}
              charWidth={
                Dimensions.get('window').width < smallBreakWidth ? 26 : 46
              }
              autoFocus={true}
              value={store.invoice.amount}
              onChangeText={amount => invoice.setAmount({ amount })}
              onSubmitEditing={() => invoice.generateUri()}
            />
            <BalanceLabelUnit style={styles.unit}>
              {store.unitFiatLabel}
            </BalanceLabelUnit>
          </BalanceLabel>
          <FormStretcher style={styles.form}>
            <InputField
              style={styles.input}
              placeholder="Note"
              value={store.invoice.note}
              onChangeText={note => invoice.setNote({ note })}
              onSubmitEditing={() => invoice.generateUri()}
            />
          </FormStretcher>
          <FormSubText style={styles.subText}>
            Generate a payment request that others can use to pay you
            immediately via the Lightning Network.
          </FormSubText>
        </Card>
      </MainContent>
      <GlasButton style={styles.nextBtn} onPress={() => invoice.generateUri()}>
        Next
      </GlasButton>
    </KeyboardAvoidingView>
  </Background>
);

InvoiceView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default observer(InvoiceView);
