import './style.css';
import { createApp } from 'vue';


import App from './App.vue';
import router from './router/router';
import 'flowbite';

const app = createApp(App);

app.use(router); 

app.mount('#app');