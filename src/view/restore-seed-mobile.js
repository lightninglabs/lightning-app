import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import SeedEntry from '../component/seed-entry';
import { Button, BackButton, SmallGlasButton } from '../component/button';
import { FormSubText } from '../component/form';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText } from '../component/text';
import { Header } from '../component/header';
import Card from '../component/card';
import { createStyles, maxWidth } from '../component/media-query';
import { smallBreakWidth } from '../component/style';

//
// Restore Seed View (Mobile)
//

const baseStyles = {
  content: {
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    maxWidth: 235,
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    title: {
      fontSize: 30,
      lineHeight: 40,
    },
  })
);

const RestoreSeedView = ({ store, wallet }) => (
  <Background image="purple-gradient-bg">
    <Header>
      <BackButton onPress={() => wallet.initPrevRestorePage()} />
      <Button disabled onPress={() => {}} />
    </Header>
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>
        Restore your wallet
      </CopyOnboardText>
      <Card>
        <FormSubText style={styles.subText}>
          {store.restoreVerifyCopy}
        </FormSubText>
        {store.restoreVerifyIndexes.map((seedIndex, i) => (
          <SeedEntry
            seedIndex={seedIndex}
            value={store.restoreSeedMnemonic[seedIndex - 1]}
            onChangeText={word =>
              wallet.setRestoreSeed({ word, index: seedIndex - 1 })
            }
            key={i}
            autoFocus={seedIndex - 1 === store.wallet.focusedRestoreInd}
            onSubmitEditing={() =>
              i === 2
                ? wallet.initNextRestorePage()
                : wallet.setFocusedRestoreInd({ index: seedIndex })
            }
            onClick={() =>
              wallet.setFocusedRestoreInd({ index: seedIndex - 1 })
            }
          />
        ))}
      </Card>
      <SmallGlasButton onPress={() => wallet.initNextRestorePage()}>
        Next
      </SmallGlasButton>
    </MainContent>
  </Background>
);

RestoreSeedView.propTypes = {
  store: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default observer(RestoreSeedView);
