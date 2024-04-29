import './assets/main.css';
import './index.css';

import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import router from './router';
import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from './plugins/firebase';

const store = createStore({
    state() {
        return {
            username: ''
        };
    },
    mutations: {
        login(state, username) {
            state.username = username;
        }
    }
});

const app = createApp(App);
app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
        // we will see other modules later on
        VueFireAuth()
    ]
});
app.use(router);
app.use(store);

app.mount('#app');
