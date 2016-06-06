import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/app.vue';
import View from './components/view.vue';
import Logger from './components/logger.vue';
import Cluster from './components/cluster.vue';
import Combined from './components/combined.vue';

Vue.use(VueRouter);
const router = new VueRouter();

router.map({
    '/combined': { component: Combined },
    '/logger': { component: Logger },
    '/view': { component: View },
    '/cluster': { component: Cluster }
});

router.start(App, '#app');
