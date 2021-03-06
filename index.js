import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app/app.vue';
import Editor from './app/editor.vue';
import Log from './app/log.vue';
import Home from './app/home.vue';

Vue.use(VueRouter);
const router = new VueRouter();

router.map({
    '/home': { component: Home },
    '/log': { component: Log },
    '/editor': { component: Editor },
});

router.start(App, '#app');
router.go('/home');
