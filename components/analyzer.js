import io from 'socket.io-client';
import jsonpatch from 'fast-json-patch';
import { state, internal } from './store';

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

            this.socket.on('internal', changes => {
                this.socket.emit('received');
                // Patch internal structure
                requestIdleCallback(_ => jsonpatch.apply(state.internal, changes));
            });

            this.socket.on('debug', data => {
                this.socket.emit('received');
                switch(data.type) {
                    case 'message':
                        requestIdleCallback(_ => state.messages.push(data));
                        break;
                    case 'log':
                        let session = state.internal.sessions.find(session => session.id === data.classcad);
                        if (session)
                            requestIdleCallback(_ => session.log.push(data));
                        break;
                }

            });
        });
    }
}
