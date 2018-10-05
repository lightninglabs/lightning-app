/**
 * @fileOverview actions to set channel state within the app and to
 * call the corresponding GRPC apis for channel management.
 */

import { toSatoshis, parseSat } from '../helper';
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
    this.update();
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
    this.update();
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
    ]);
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
        remotePubkey: channel.remote_pubkey,
        id: channel.chan_id,
        capacity: parseSat(channel.capacity),
        localBalance: parseSat(channel.local_balance),
        remoteBalance: parseSat(channel.remote_balance),
        channelPoint: channel.channel_point,
        fundingTxId: this._parseChannelPoint(channel.channel_point)
          .funding_txid_str,
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
   * the pendingChannels array in the global store.
   * @return {Promise<undefined>}
   */
  async getPendingChannels() {
    try {
      const response = await this._grpc.sendCommand('pendingChannels');
      const mapPendingAttributes = channel => ({
        remotePubkey: channel.remote_node_pub,
        capacity: parseSat(channel.capacity),
        localBalance: parseSat(channel.local_balance),
        remoteBalance: parseSat(channel.remote_balance),
        channelPoint: channel.channel_point,
        fundingTxId: this._parseChannelPoint(channel.channel_point)
          .funding_txid_str,
      });
      const pocs = response.pending_open_channels.map(poc => ({
        ...mapPendingAttributes(poc.channel),
        confirmationHeight: poc.confirmation_height,
        blocksTillOpen: poc.blocks_till_open,
        commitFee: poc.commit_fee,
        commitWeight: poc.commit_weight,
        feePerKw: poc.fee_per_kw,
        status: 'pending-open',
      }));
      const pccs = response.pending_closing_channels.map(pcc => ({
        ...mapPendingAttributes(pcc.channel),
        closingTxid: pcc.closing_txid,
        status: 'pending-closing',
      }));
      const pfccs = response.pending_force_closing_channels.map(pfcc => ({
        ...mapPendingAttributes(pfcc.channel),
        closingTxid: pfcc.closing_txid,
        limboBalance: pfcc.limbo_balance,
        maturityHeight: pfcc.maturity_height,
        blocksTilMaturity: pfcc.blocks_til_maturity,
        status: 'pending-force-closing',
      }));
      const wccs = response.waiting_close_channels.map(wcc => ({
        ...mapPendingAttributes(wcc.channel),
        limboBalance: wcc.limbo_balance,
        status: 'waiting-close',
      }));
      this._store.pendingChannels = [].concat(pocs, pccs, pfccs, wccs);
    } catch (err) {
      log.error('Listing pending channels failed', err);
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
        pubKey: peer.pub_key,
        peerId: peer.peer_id,
        address: peer.address,
        bytesSent: peer.bytes_sent,
        bytesRecv: peer.bytes_recv,
        satSent: peer.sat_sent,
        satRecv: peer.sat_recv,
        inbound: peer.inbound,
        pingTime: peer.ping_time,
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
      node_pubkey: new Buffer(pubkey, 'hex'),
      local_funding_amount: amount,
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
  async closeSelectedChannel(force = false) {
    try {
      const { selectedChannel } = this._store;
      this._nav.goChannels();
      await this.closeChannel({
        channelPoint: selectedChannel.channelPoint,
        force,
      });
    } catch (err) {
      if (
        err &&
        err.details &&
        err.details.includes('try force closing it instead')
      ) {
        this._nav.goChannelForceDelete();
      } else {
        this._notification.display({ msg: 'Closing channel failed!', err });
      }
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
      channel_point: this._parseChannelPoint(channelPoint),
      force,
    });
    await new Promise((resolve, reject) => {
      stream.on('data', data => {
        if (data.close_pending) {
          this.update();
        }
        if (data.chan_close) {
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
      funding_txid_str: channelPoint.split(':')[0],
      output_index: parseInt(channelPoint.split(':')[1], 10),
    };
  }

  _removeClosedChannel(channelPoint) {
    const pc = this._store.pendingChannels;
    const channel = pc.find(c => c.channelPoint === channelPoint);
    if (channel) pc.splice(pc.indexOf(channel));
  }
}

export default ChannelAction;
