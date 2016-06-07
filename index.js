import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/app.vue';
import View from './components/view.vue';
import Logger from './components/logger.vue';
import Cluster from './components/cluster.vue';
import Combined from './components/combined.vue';
import Stdout from './components/stdout.vue';

Vue.use(VueRouter);
const router = new VueRouter();

router.map({
    '/': { component: Combined },
    '/combined': { component: Combined },
    '/logger': { component: Logger },
    '/view': { component: View },
    '/stdout': { component: Stdout }
});

router.start(App, '#app');
