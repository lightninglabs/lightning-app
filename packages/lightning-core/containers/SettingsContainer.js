import { connect } from 'react-redux'
import { store } from 'lightning-store'

import Settings from '../components/Settings'

const mapStateToProps = state => ({
  logs: store.getRecentLogs(state),
  account: store.getAccountInfo(state),
})

const SettingsContainer = connect(
  mapStateToProps
)(Settings)

export default SettingsContainer
