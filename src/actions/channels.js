import { observe } from 'mobx';
import store from '../store';
import ActionsGrpc from './grpc';
import { RETRY_DELAY } from '../config';

class ActionsChannels {
  constructor() {
    observe(store, 'lndReady', () => {
      this.getChannels();
      this.getPendingChannels();
      this.getPeers();
    });
  }

  getChannels() {
    ActionsGrpc.sendCommand('listChannels')
      .then(response => {
        store.channelsResponse = response.channels.map(channel => ({
          remotePubkey: channel.remote_pubkey,
          id: channel.chan_id,
          capacity: channel.capacity,
          localBalance: channel.local_balance,
          remoteBalance: channel.remote_balance,
          channelPoint: channel.channel_point,
          active: channel.active,
          status: 'open',
        }));
      })
      .catch(() => {
        clearTimeout(this.tgetChannels);
        this.tgetChannels = setTimeout(() => this.getChannels(), RETRY_DELAY);
      });
  }

  getPendingChannels() {
    ActionsGrpc.sendCommand('pendingChannels')
      .then(response => {
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
        store.pendingChannelsResponse = [].concat(pocs, pccs, pfccs);
      })
      .catch(() => {
        clearTimeout(this.tgetPendingChannels);
        this.tgetPendingChannels = setTimeout(
          () => this.getPendingChannels(),
          RETRY_DELAY
        );
      });
  }

  getPeers() {
    ActionsGrpc.sendCommand('listPeers')
      .then(response => {
        store.peersResponse = response.peers;
      })
      .catch(() => {
        clearTimeout(this.tgetPeers);
        this.tgetPeers = setTimeout(() => this.getPeers(), RETRY_DELAY);
      });
  }

  connectToPeer(host, pubkey) {
    ActionsGrpc.sendCommand('connectPeer', {
      addr: {
        host,
        pubkey,
      },
    })
      .then(response => {
        console.log('CHANNELS: connectToPeer', response);
      })
      .catch(() => {
        // clearTimeout(this.tconnectToPeer);
        // this.tconnectToPeer = setTimeout(() => this.connectToPeer(host, pubkey), RETRY_DELAY);
      });
  }

  openChannel(pubkey, amount) {
    ActionsGrpc.sendStreamCommand('connectPeer', {
      node_pubkey: new Buffer(pubkey, 'hex'),
      local_funding_amount: amount,
      num_confs: 1,
    })
      .then(response => {
        console.log('CHANNELS: openChannel', response);
      })
      .catch(() => {
        // clearTimeout(this.tconnectToPeer);
        // this.tconnectToPeer = setTimeout(() => this.connectToPeer(), RETRY_DELAY);
      });
  }
}

export default new ActionsChannels();
