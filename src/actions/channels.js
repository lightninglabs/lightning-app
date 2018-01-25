import { observe } from 'mobx';
import { RETRY_DELAY } from '../config';

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

  getChannels() {
    this._actionsGrpc
      .sendCommand('listChannels')
      .then(response => {
        this._store.channelsResponse = response.channels.map(channel => ({
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
    this._actionsGrpc
      .sendCommand('pendingChannels')
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
        this._store.pendingChannelsResponse = [].concat(pocs, pccs, pfccs);
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
    this._actionsGrpc
      .sendCommand('listPeers')
      .then(response => {
        this._store.peersResponse = response.peers;
      })
      .catch(() => {
        clearTimeout(this.tgetPeers);
        this.tgetPeers = setTimeout(() => this.getPeers(), RETRY_DELAY);
      });
  }

  connectToPeer(host, pubkey) {
    this._actionsGrpc
      .sendCommand('connectPeer', {
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
    this._actionsGrpc
      .sendStreamCommand('connectPeer', {
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

export default ActionsChannels;
