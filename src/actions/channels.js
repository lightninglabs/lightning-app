import { RETRY_DELAY } from '../config';
import { reverse } from '../helpers';
import * as log from './logs';

class ChannelAction {
  constructor(store, grpc, notification) {
    this._store = store;
    this._grpc = grpc;
    this._notification = notification;
  }

  async pollChannels() {
    clearTimeout(this.tpollChannels);
    try {
      await this.getChannels();
    } catch (err) {
      log.error('Listing channels failed', err);
    }
    this.tpollChannels = setTimeout(() => this.pollChannels(), RETRY_DELAY);
  }

  async getChannels() {
    const { channels } = await this._grpc.sendCommand('listChannels');
    this._store.channels = channels.map(channel => ({
      remotePubkey: channel.remote_pubkey,
      id: channel.chan_id,
      capacity: channel.capacity,
      localBalance: channel.local_balance,
      remoteBalance: channel.remote_balance,
      channelPoint: channel.channel_point,
      active: channel.active,
      status: 'open',
    }));
  }

  async pollPendingChannels() {
    clearTimeout(this.tpPending);
    try {
      await this.getPendingChannels();
    } catch (err) {
      log.error('Listing pending channels failed', err);
    }
    this.tpPending = setTimeout(() => this.pollPendingChannels(), RETRY_DELAY);
  }

  async getPendingChannels() {
    const response = await this._grpc.sendCommand('pendingChannels');
    const pocs = response.pending_open_channels.map(poc => ({
      channel: poc.channel,
      confirmationHeight: poc.confirmation_height,
      blocksTillOpen: poc.blocks_till_open,
      commitFee: poc.commit_fee,
      commitWeight: poc.commit_weight,
      feePerKw: poc.fee_per_kw,
      status: 'pending-open',
    }));
    const pccs = response.pending_closing_channels.map(pcc => ({
      channel: pcc.channel,
      closingTxid: pcc.closing_txid,
      status: 'pending-closing',
    }));
    const pfccs = response.pending_force_closing_channels.map(pfcc => ({
      channel: pfcc.channel,
      closingTxid: pfcc.closing_txid,
      limboBalance: pfcc.limbo_balance,
      maturityHeight: pfcc.maturity_height,
      blocksTilMaturity: pfcc.blocks_til_maturity,
      status: 'pending-force-closing',
    }));
    this._store.pendingChannels = [].concat(pocs, pccs, pfccs);
  }

  async pollPeers() {
    clearTimeout(this.tgetPeers);
    try {
      await this.getPeers();
    } catch (err) {
      log.error('Listing peers failed', err);
    }
    this.tgetPeers = setTimeout(() => this.pollPeers(), RETRY_DELAY);
  }

  async getPeers() {
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
  }

  async connectAndOpen({ pubkeyAtHost, amount }) {
    try {
      const pubkey = pubkeyAtHost.split('@')[0];
      const host = pubkeyAtHost.split('@')[1];
      await this.connectToPeer({ host, pubkey });
      await this.openChannel({ pubkey, amount });
    } catch (err) {
      this._notification.display({ msg: 'Opening channel failed!', err });
    }
  }

  async connectToPeer({ host, pubkey }) {
    try {
      await this._grpc.sendCommand('connectPeer', {
        addr: { host, pubkey },
      });
      await this.getPeers();
    } catch (err) {
      this._notification.display({ msg: 'Connecting to peer failed!', err });
    }
  }

  async openChannel({ pubkey, amount }) {
    const stream = this._grpc.sendStreamCommand('openChannel', {
      node_pubkey: new Buffer(pubkey, 'hex'),
      local_funding_amount: amount,
    });
    await new Promise((resolve, reject) => {
      stream.on('data', () => {
        this.getPendingChannels();
        this.getChannels();
      });
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Opening channel: ${status}`));
    });
  }

  async closeChannel({ channelPoint, force = false }) {
    const stream = this._grpc.sendStreamCommand('closeChannel', {
      channel_point: this._parseChannelPoint(channelPoint),
      force,
    });
    await new Promise((resolve, reject) => {
      stream.on('data', data => {
        if (data.close_pending) {
          this.getPendingChannels();
          this.getChannels();
        }
        if (data.chan_close) {
          this._removeClosedChannel(data.chan_close.closing_txid);
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

  _removeClosedChannel(closingTxid) {
    if (!(closingTxid instanceof Buffer)) {
      throw new Error('Invalid closing txid');
    }
    const txid = reverse(closingTxid).toString('hex');
    const pc = this._store.pendingChannels;
    const channel = pc.find(c => c.closingTxid === txid);
    if (channel) pc.splice(pc.indexOf(channel));
  }
}

export default ChannelAction;
