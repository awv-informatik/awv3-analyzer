import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import Editor from './editor/editor.vue';
import Log from './log/log.vue';
import Home from './home/home.vue';

Vue.use(VueRouter);
const router = new VueRouter();

router.map({
    '/home': { component: Home },
    '/log': { component: Log },
    '/editor': { component: Editor },
});

router.start(App, '#app');
router.redirect({ '/': '/home' });
