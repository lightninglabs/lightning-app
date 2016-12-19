import { connect } from 'react-redux'
import { store } from 'lightning-store'
import { actions as notificationsActions } from 'lightning-notifications'
import { actions as channelsActions } from '../reducers/channels'

import ChannelsCreate from '../components/ChannelsCreate'

const mapStateToProps = state => ({
  currency: store.getCurrency(state),
  isSynced: store.getSyncedToChain(state),
  ...store.getChannelsCreateForm(state),
})

const ChannelsCreateContainer = connect(
  mapStateToProps,
  { ...channelsActions, ...notificationsActions }
)(ChannelsCreate)

export default ChannelsCreateContainer
