import { state } from './store';
import io from 'socket.io-client';
import jsonpatch from 'fast-json-patch';
import SocketIO from 'awv3/communication/socketio';

export default class extends SocketIO {
    constructor() {
        super({ debug: true, credentials: [] });
        this.on('connected', socket => {
            this.socket.on('debug', data => {
                SocketIO._ack(this.socket);
                requestAnimationFrame(_ => {
                    if (data.type === 'patch')
                        jsonpatch.apply(state.internal, data.patch);
                    else if (data.type === 'message')
                        state.messages.push(data);
                });
            });
        });
    }
}
