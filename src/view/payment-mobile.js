import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { InputField } from '../component/field';
import { Header, Title } from '../component/header';
import { CancelButton, Button, GlasButton } from '../component/button';
import Card from '../component/card';
import LightningBoltIcon from '../asset/icon/lightning-bolt';
import { FormStretcher, FormText, FormSubText } from '../component/form';
import QRCodeScanner from '../component/qrcode-scanner';
import { color } from '../component/style';

const styles = StyleSheet.create({
  btnWrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  btnLeft: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: color.purple,
  },
  btnRight: {
    flex: 1,
    borderLeftWidth: 0.5,
    borderLeftColor: color.purple,
  },
});

const PaymentView = ({ store, nav, payment }) => (
  <Background color={color.purple}>
    <Header color={color.purple}>
      <Button disabled onPress={() => {}} />
      <Title title="Lightning Payment">
        <LightningBoltIcon height={12} width={6.1} />
      </Title>
      <CancelButton onPress={() => nav.goHome()} />
    </Header>
    {store.payment.useScanner ? (
      <QRCodeScanner
        onQRCodeScanned={({ data }) => payment.readQRCode({ data })}
      />
    ) : (
      <PaymentCard store={store} payment={payment} />
    )}
    <View style={styles.btnWrapper}>
      <GlasButton onPress={() => payment.pasteAddress()} style={styles.btnLeft}>
        Paste
      </GlasButton>
      <GlasButton
        onPress={() => payment.toggleScanner()}
        style={styles.btnRight}
      >
        Scan
      </GlasButton>
    </View>
  </Background>
);

PaymentView.propTypes = {
  store: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

//
// Payment Card
//

const cardStyles = StyleSheet.create({
  subText: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const PaymentCard = ({ store, payment }) => (
  <MainContent>
    <Card>
      <FormText>
        Paste the Lightning Payment Request or the Bitcoin Address to which
        you’re sending.
      </FormText>
      <FormStretcher>
        <InputField
          placeholder="Payment Request / Bitcoin Address"
          value={store.payment.address}
          onChangeText={address => payment.setAddress({ address })}
          onSubmitEditing={() => payment.checkType()}
        />
        <FormSubText style={cardStyles.subText}>
          Only Lightning Payment Requests or Bitcoin addresses will work at this
          time.
        </FormSubText>
      </FormStretcher>
    </Card>
  </MainContent>
);

PaymentCard.propTypes = {
  store: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
};

export default observer(PaymentView);
