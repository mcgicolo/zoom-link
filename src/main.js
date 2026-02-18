import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

const defaultConfig = { zoom: { meetingId: '' }, contact: { name: '', phone: '' }, localeList: [] };

fetch('./config.json')
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error('config not found'))))
  .catch(() => defaultConfig)
  .then((config) => {
    createApp(App).provide('appConfig', config).mount('#app');
  });
