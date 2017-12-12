import store from '../store';
const { remote } = window.require('electron');

class ActionsGrpc {
  constructor() {
    const serverReady = remote.getGlobal('serverReady');
    if (serverReady) {
      serverReady(err => {
        console.log('GRPC serverReady', err);
        store.lndReady = true;
      });
    } else {
      console.error('GRPC: ERROR no serverReady');
    }

    try {
      this.client = remote.getGlobal('connection');
    } catch (err) {
      console.error('GRPC: Error Connecting to GRPC Server', err);
    }

    try {
      this.metadata = remote.getGlobal('metadata');
    } catch (err) {
      console.error('GRPC: Error getting metadata', err);
    }
  }

  sendCommand(method, body) {
    return new Promise((resolve, reject) => {
      const { lndReady } = store;
      if (!lndReady) return reject(new Error('Server Still Starting'));
      if (!this.client) return reject(new Error('Could not connect over grpc'));
      if (!this.client[method]) return reject(new Error('Invalid Method'));

      let streaming = false; // TODO: FIX!
      if (streaming) {
        try {
          const response = this.client[method](
            this.metadata,
            body ? { body } : {}
          ); // TODO: Pass proper data?
          console.log('GRPC: Stream Response', method, response);
          resolve(response);
        } catch (err) {
          console.log('GRPC: Error From Stream Method', method, err);
          reject(err);
        }
      } else {
        const now = new Date();
        const deadline = now.setSeconds(now.getSeconds() + 30);

        this.client[method](
          body,
          this.metadata,
          { deadline },
          (err, response) => {
            if (!err) {
              console.log('GRPC: Response', method, response);
              resolve(response);
            } else {
              console.log('GRPC: Error From Method', method, err);
              reject(err);
            }
          }
        );
      }
    });
  }
}

export default new ActionsGrpc();
