import { MACAROONS_ENABLED } from '../config';
import * as log from './logs';

class ActionsGrpc {
  constructor(store, remote) {
    this._store = store;
    const serverReady = remote.getGlobal('serverReady');
    if (serverReady) {
      serverReady(err => {
        if (err) {
          log.error('GRPC: serverReady ERROR', err);
          return;
        }
        log.info('GRPC serverReady');
        this._store.lndReady = true;
      });
    } else {
      log.error('GRPC: ERROR no serverReady');
    }

    try {
      this.client = remote.getGlobal('connection');
    } catch (err) {
      log.error('GRPC: Error Connecting to GRPC Server', err);
    }

    if (MACAROONS_ENABLED) {
      try {
        this.metadata = remote.getGlobal('metadata');
      } catch (err) {
        log.error('GRPC: Error getting metadata', err);
      }
      log.info('GRPC: Macaroons enabled');
    } else {
      log.info('GRPC: Macaroons disabled');
    }
  }

  sendCommand(method, body) {
    return new Promise((resolve, reject) => {
      const { lndReady } = this._store;
      if (!lndReady) return reject(new Error('Server still starting'));
      if (!this.client) return reject(new Error('Could not connect over grpc'));
      if (!this.client[method]) return reject(new Error('Invalid rpc method'));

      const now = new Date();
      const deadline = new Date(now.getTime() + 300000);

      const handleResponse = (err, response) => {
        if (err) {
          log.info('GRPC: Error From Method', method, err);
          return reject(err);
        }
        resolve(response);
      };

      if (MACAROONS_ENABLED) {
        this.client[method](body, this.metadata, { deadline }, handleResponse);
      } else {
        this.client[method](body, { deadline }, handleResponse);
      }
    });
  }

  sendStreamCommand(method, body) {
    return new Promise((resolve, reject) => {
      const { lndReady } = this._store;
      if (!lndReady) return reject(new Error('Server still starting'));
      if (!this.client) return reject(new Error('Could not connect over grpc'));
      if (!this.client[method]) return reject(new Error('Invalid rpc method'));

      try {
        let response;
        if (MACAROONS_ENABLED) {
          response = this.client[method](this.metadata, body ? { body } : {});
        } else {
          response = this.client[method](body ? { body } : {});
        }
        log.info('GRPC: Stream Response', method, response);
        resolve(response);
      } catch (err) {
        log.info('GRPC: Error From Stream Method', method, err);
        reject(err);
      }
    });
  }
}

export default ActionsGrpc;
