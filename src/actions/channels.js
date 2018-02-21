import { observe } from 'mobx';
import { RETRY_DELAY } from '../config';
import * as log from './logs';

class ActionsChannels {
  constructor(store, actionsGrpc) {
    this._store = store;
    this._actionsGrpc = actionsGrpc;
    observe(this._store, 'lndReady', () => {
      this.getChannels();
      this.getPendingChannels();
      this.getPeers();
    });
  }

  async getChannels() {
    try {
      const { channels } = await this._actionsGrpc.sendCommand('listChannels');
      this._store.channelsResponse = channels.map(channel => ({
        remotePubkey: channel.remote_pubkey,
        id: channel.chan_id,
        capacity: channel.capacity,
        localBalance: channel.local_balance,
        remoteBalance: channel.remote_balance,
        channelPoint: channel.channel_point,
        active: channel.active,
        status: 'open',
      }));
    } catch (err) {
      clearTimeout(this.tgetChannels);
      this.tgetChannels = setTimeout(() => this.getChannels(), RETRY_DELAY);
    }
  }

  async getPendingChannels() {
    try {
      const response = await this._actionsGrpc.sendCommand('pendingChannels');
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
      this._store.pendingChannelsResponse = [].concat(pocs, pccs, pfccs);
    } catch (err) {
      clearTimeout(this.tgetPendingChannels);
      this.tgetPendingChannels = setTimeout(
        () => this.getPendingChannels(),
        RETRY_DELAY
      );
    }
  }

  async getPeers() {
    try {
      const { peers } = await this._actionsGrpc.sendCommand('listPeers');
      this._store.peersResponse = peers.map(peer => ({
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
      clearTimeout(this.tgetPeers);
      this.tgetPeers = setTimeout(() => this.getPeers(), RETRY_DELAY);
    }
  }

  async connectToPeer(host, pubkey) {
    const { peer_id } = await this._actionsGrpc.sendCommand('connectPeer', {
      addr: { host, pubkey },
    });
    return {
      peerId: peer_id,
    };
  }

  async openChannel(pubkey, amount) {
    const stream = this._actionsGrpc.sendStreamCommand('openChannel', {
      node_pubkey: new Buffer(pubkey, 'hex'),
      local_funding_amount: amount,
      num_confs: 1,
    });
    await new Promise((resolve, reject) => {
      stream.on('data', data => {
        if (data.chan_pending) this.getPendingChannels();
        if (data.chan_open) this.getChannels();
      });
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('status', status => log.info(`Opening channel: ${status}`));
    });
  }
}

export default ActionsChannels;
