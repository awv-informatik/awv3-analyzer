import io from 'socket.io-client';
import { state } from './store';

export default class {
    connect(url) {
        return new Promise(resolve => {
            this.url = url;
            this.socket = io.connect(url);
            this.socket.once("connect", () => {
                console.log("connected")
                this.socket.once('permission', data => resolve(this));
                this.socket.emit('init', { debug: true });
            });
            this.socket.on('debug', data => {
                this.socket.emit('received');
                switch(data.type) {
                    case 'message':
                        requestIdleCallback(_ => state.messages.push(data));
                        break;
                    case 'system':
                        requestIdleCallback(_ => state.internal = data);
                        break;
                }

            });
        });
    }
}
