import { MACAROONS_ENABLED } from '../config';

class ActionsGrpc {
  constructor(store, remote) {
    this._store = store;
    const serverReady = remote.getGlobal('serverReady');
    if (serverReady) {
      serverReady(err => {
        if (err) {
          console.error('GRPC: serverReady ERROR', err);
          return;
        }
        console.log('GRPC serverReady');
        this._store.lndReady = true;
      });
    } else {
      console.error('GRPC: ERROR no serverReady');
    }

    try {
      this.client = remote.getGlobal('connection');
    } catch (err) {
      console.error('GRPC: Error Connecting to GRPC Server', err);
    }

    if (MACAROONS_ENABLED) {
      try {
        this.metadata = remote.getGlobal('metadata');
      } catch (err) {
        console.error('GRPC: Error getting metadata', err);
      }
      console.log('GRPC: Macaroons enabled');
    } else {
      console.log('GRPC: Macaroons disabled');
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
          console.log('GRPC: Error From Method', method, err);
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
        console.log('GRPC: Stream Response', method, response);
        resolve(response);
      } catch (err) {
        console.log('GRPC: Error From Stream Method', method, err);
        reject(err);
      }
    });
  }
}

export default ActionsGrpc;
