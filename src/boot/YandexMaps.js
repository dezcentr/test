import { createYmaps } from 'vue-yandex-maps';
import {boot} from "quasar/wrappers";

export default boot(({ app }) => {
  app.use(createYmaps({
    apikey: process.env.API_KEY_YANDEX_MAP,
    lang: 'ru_RU'
  }));
  console.log('YANDEX MAPS INIT!')
})
