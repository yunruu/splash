import './assets/main.css';
import './index.css';

import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import router from './router';
import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from './plugins/firebase';
import { getUserFromStorage, removeUserFromStorage, saveUserToStorage } from './utils/storage';

const store = createStore({
    state() {
        return {
            username: ''
        };
    },
    mutations: {
        login(state, username) {
            state.username = username;
            saveUserToStorage(username.username);
        },
        logout(state) {
            state.username = null;
            removeUserFromStorage();
        }
    },
    getters: {
        getUsername(state) {
            if (state.username?.username) {
                return state.username.username;
            }
            const userInLocal = getUserFromStorage();
            if (userInLocal) {
                state.username = userInLocal;
            }
            return userInLocal;
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
