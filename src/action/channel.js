/**
 * @fileOverview actions to set channel state within the app and to
 * call the corresponding GRPC apis for channel management.
 */

import { MED_TARGET_CONF } from '../config';
import { toSatoshis, poll, getTimeTilAvailable } from '../helper';
import * as log from './log';

class ChannelAction {
  constructor(store, grpc, nav, notification) {
    this._store = store;
    this._grpc = grpc;
    this._nav = nav;
    this._notification = notification;
  }

  //
  // Create channel actions
  //

  /**
   * Initiate the create channel view by resetting input values
   * and then navigating to the view.
   * @return {undefined}
   */
  initCreate() {
    this._store.channel.pubkeyAtHost = '';
    this._store.channel.amount = '';
    this._nav.goChannelCreate();
  }

  /**
   * Set the amount input for the create channel view. This amount
   * is either in btc or fiat depending on user settings.
   * @param {string} options.amount The string formatted number
   */
  setAmount({ amount }) {
    this._store.channel.amount = amount;
  }

  /**
   * Set the channel public key and hostname in a single variable
   * which can be parsed before calling the create channel grpc api.
   * @param {string} options.pubkeyAtHost The combined public key and host
   */
  setPubkeyAtHost({ pubkeyAtHost }) {
    this._store.channel.pubkeyAtHost = pubkeyAtHost;
  }

  //
  // Channel list actions
  //

  /**
   * Initiate the channel list view by navigating to the view and updating
   * the app's channel state by calling all necessary grpc apis.
   * @return {undefined}
   */
  init() {
    this._nav.goChannels();
  }

  /**
   * Select a channel item from the channel list view and then navigate
   * to the detail view to list channel parameters.
   * @param  {Object} options.item The selected channel object
   * @return {undefined}
   */
  select({ item }) {
    this._store.selectedChannel = item;
    this._nav.goChannelDetail();
  }

  /**
   * Update the peers, channels, and pending channels in the app state
   * by querying all required grpc apis.
   * @return {Promise<undefined>}
   */
  async update() {
    await Promise.all([
      this.getPeers(),
      this.getChannels(),
      this.getPendingChannels(),
      this.getClosedChannels(),
    ]);
  }

  /**
   * Poll the channels in the background since there is no streaming grpc api
   * @return {Promise<undefined>}
   */
  async pollChannels() {
    await poll(() => this.update());
  }

  //
  // Generic channel actions
  //

  /**
   * List the open channels by calling the respective grpc api and updating
   * the channels array in the global store.
   * @return {Promise<undefined>}
   */
  async getChannels() {
    try {
      const { channels } = await this._grpc.sendCommand('listChannels');
      this._store.channels = channels.map(channel => ({
        remotePubkey: channel.remotePubkey,
        id: channel.chanId,
        capacity: channel.capacity,
        localBalance: channel.localBalance,
        remoteBalance: channel.remoteBalance,
        commitFee: channel.commitFee,
        channelPoint: channel.channelPoint,
        fundingTxId: this._parseChannelPoint(channel.channelPoint)
          .fundingTxidStr,
        active: channel.active,
        private: channel.private,
        status: 'open',
      }));
    } catch (err) {
      log.error('Listing channels failed', err);
    }
  }

  /**
   * List the pending channels by calling the respective grpc api and updating
   * the pendingChannels array and limbo balance in the global store.
   * @return {Promise<undefined>}
   */
  async getPendingChannels() {
    try {
      const response = await this._grpc.sendCommand('pendingChannels');
      const mapPendingAttributes = channel => ({
        remotePubkey: channel.remoteNodePub,
        capacity: channel.capacity,
        localBalance: channel.localBalance,
        remoteBalance: channel.remoteBalance,
        channelPoint: channel.channelPoint,
        fundingTxId: this._parseChannelPoint(channel.channelPoint)
          .fundingTxidStr,
      });
      const pocs = response.pendingOpenChannels.map(poc => ({
        ...mapPendingAttributes(poc.channel),
        confirmationHeight: poc.confirmationHeight,
        blocksTillOpen: poc.blocksTillOpen,
        commitFee: poc.commitFee,
        feePerKw: poc.feePerKw,
        status: 'pending-open',
      }));
      const pccs = response.pendingClosingChannels.map(pcc => ({
        ...mapPendingAttributes(pcc.channel),
        closingTxId: pcc.closingTxid,
        status: 'pending-closing',
      }));
      const pfccs = response.pendingForceClosingChannels.map(pfcc => ({
        ...mapPendingAttributes(pfcc.channel),
        closingTxId: pfcc.closingTxid,
        limboBalance: pfcc.limboBalance,
        maturityHeight: pfcc.maturityHeight,
        blocksTilMaturity: pfcc.blocksTilMaturity,
        timeTilAvailable: getTimeTilAvailable(pfcc.blocksTilMaturity),
        status: 'pending-force-closing',
      }));
      const wccs = response.waitingCloseChannels.map(wcc => ({
        ...mapPendingAttributes(wcc.channel),
        limboBalance: wcc.limboBalance,
        status: 'waiting-close',
      }));
      this._store.pendingChannels = [].concat(pocs, pccs, pfccs, wccs);
    } catch (err) {
      log.error('Listing pending channels failed', err);
    }
  }

  /**
   * List the closed channels by calling the respective grpc api and updating
   * the closed channels array in the global store.
   * @return {Promise<undefined>}
   */
  async getClosedChannels() {
    try {
      const { channels } = await this._grpc.sendCommand('closedChannels');
      this._store.closedChannels = channels.map(channel => ({
        remotePubkey: channel.remotePubkey,
        capacity: channel.capacity,
        channelPoint: channel.channelPoint,
        fundingTxId: this._parseChannelPoint(channel.channelPoint)
          .fundingTxidStr,
        localBalance: channel.settledBalance,
        remoteBalance: channel.capacity - channel.settledBalance,
        closingTxId: channel.closingTxHash,
        status: 'closed',
      }));
    } catch (err) {
      log.error('Listing closed channels failed', err);
    }
  }

  /**
   * List the peers by calling the respective grpc api and updating
   * the peers array in the global store.
   * @return {Promise<undefined>}
   */
  async getPeers() {
    try {
      const { peers } = await this._grpc.sendCommand('listPeers');
      this._store.peers = peers.map(peer => ({
        pubKey: peer.pubKey,
        peerId: peer.peerId,
        address: peer.address,
        bytesSent: peer.bytesSent,
        bytesRecv: peer.bytesRecv,
        satSent: peer.satSent,
        satRecv: peer.satRecv,
        inbound: peer.inbound,
        pingTime: peer.pingTime,
      }));
    } catch (err) {
      log.error('Listing peers failed', err);
    }
  }

  /**
   * Attempt to connect to a peer and open a channel in a single call.
   * If a connection already exists, just a channel will be opened.
   * This action can be called from a view event handler as does all
   * the necessary error handling and notification display.
   * @return {Promise<undefined>}
   */
  async connectAndOpen() {
    try {
      const { channel, settings } = this._store;
      const amount = toSatoshis(channel.amount, settings);
      if (!channel.pubkeyAtHost.includes('@')) {
        return this._notification.display({ msg: 'Please enter pubkey@host' });
      }
      this._nav.goChannels();
      const pubkey = channel.pubkeyAtHost.split('@')[0];
      const host = channel.pubkeyAtHost.split('@')[1];
      await this.connectToPeer({ host, pubkey });
      await this.openChannel({ pubkey, amount });
    } catch (err) {
      this._nav.goChannelCreate();
      this._notification.display({ msg: 'Creating channel failed!', err });
    }
  }

  /**
   * Connect to peer and fail gracefully by catching exceptions and
   * logging their output.
   * @param  {string} options.host   The hostname of the peer
   * @param  {string} options.pubkey The public key of the peer
   * @return {Promise<undefined>}
   */
  async connectToPeer({ host, pubkey }) {
    try {
      await this._grpc.sendCommand('connectPeer', {
        addr: { host, pubkey },
      });
    } catch (err) {
      log.info('Connecting to peer failed', err);
    }
  }

  /**
   * Open a channel to a peer without advertising it and update channel
   * state on data event from the streaming grpc api.
   * @param  {string} options.pubkey The public key of the peer
   * @param  {number} options.amount The amount in satoshis to fund the channel
   * @return {Promise<undefined>}
   */
  async openChannel({ pubkey, amount }) {
    const stream = this._grpc.sendStreamCommand('openChannel', {
      nodePubkey: Buffer.from(pubkey, 'hex'),
      localFundingAmount: amount,
      private: true,
    });
    await new Promise((resolve, reject) => {
      stream.on('data', () => this.update());
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Opening channel: ${status}`));
    });
  }

  /**
   * Close the selected channel by attempting a cooperative close.
   * This action can be called from a view event handler as does all
   * the necessary error handling and notification display.
   * @return {Promise<undefined>}
   */
  async closeSelectedChannel() {
    try {
      const { selectedChannel: selected } = this._store;
      this._nav.goChannels();
      await this.closeChannel({
        channelPoint: selected.channelPoint,
        force: selected.status !== 'open' || !selected.active,
      });
    } catch (err) {
      this._notification.display({ msg: 'Closing channel failed!', err });
    }
  }

  /**
   * Close a channel using the grpc streaming api and update the state
   * on data events. Once the channel close is complete the channel will
   * be removed from the channels array in the store.
   * @param  {string}  options.channelPoint The channel identifier
   * @param  {Boolean} options.force        Force or cooperative close
   * @return {Promise<undefined>}
   */
  async closeChannel({ channelPoint, force = false }) {
    const stream = this._grpc.sendStreamCommand('closeChannel', {
      channelPoint: this._parseChannelPoint(channelPoint),
      force,
      targetConf: force ? undefined : MED_TARGET_CONF,
    });
    await new Promise((resolve, reject) => {
      stream.on('data', data => {
        if (data.closePending) {
          this.update();
        }
        if (data.chanClose) {
          this._removeClosedChannel(channelPoint);
        }
      });
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Closing channel: ${status}`));
    });
  }

  _parseChannelPoint(channelPoint) {
    if (!channelPoint || !channelPoint.includes(':')) {
      throw new Error('Invalid channel point');
    }
    return {
      fundingTxidStr: channelPoint.split(':')[0],
      outputIndex: parseInt(channelPoint.split(':')[1], 10),
    };
  }

  _removeClosedChannel(channelPoint) {
    const pc = this._store.pendingChannels;
    const channel = pc.find(c => c.channelPoint === channelPoint);
    if (channel) pc.splice(pc.indexOf(channel));
  }
}

export default ChannelAction;
