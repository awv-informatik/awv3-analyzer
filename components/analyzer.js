import io from 'socket.io-client';
import jsonpatch from 'fast-json-patch';
import SocketIO from 'awv3/communication/socketio';
import { state, internal } from './store';

export default class {
    connect(url) {
        return new Promise((resolve, reject) => {
            this.url = url;
            this.socket = io.connect(url);
            this.socket.once("connect", () => {
                this.socket.once('permission', data => resolve(this));
                this.socket.emit('init', { debug: true });
            });

            this.socket.on('connect_error', reason => reject(reason));
            this.socket.on('connect_timeout', reason => reject(reason));
            this.socket.on('debug', data => {
                SocketIO._ack(this.socket);
                switch(data.type) {
                    case 'patch':
                        requestIdleCallback(_ => jsonpatch.apply(state.internal, data.patch));
                        break;
                    case 'message':
                        console.log(data)
                        requestIdleCallback(_ => state.messages.push(data));
                        break;
                }

            });
        });
    }
}
