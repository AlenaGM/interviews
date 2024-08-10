import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.scss'

import { initializeApp } from 'firebase/app'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Toast from 'primevue/toast'
import Tooltip from 'primevue/tooltip'

import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import RadioButton from 'primevue/radiobutton'
import Badge from 'primevue/badge'
import Chart from 'primevue/chart'

import ConfirmDialog from 'primevue/confirmdialog'
import Message from 'primevue/message'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyCCEPqM0X4nmDy9xJVDJU-6Y6Uc9B5KhkU',
  authDomain: 'interviews-5f465.firebaseapp.com',
  projectId: 'interviews-5f465',
  storageBucket: 'interviews-5f465.appspot.com',
  messagingSenderId: '986271738290',
  appId: '1:986271738290:web:53583f4f4915bad3b99cab'
}

initializeApp(firebaseConfig)

import en from './locales/en.json'
import ru from './locales/ru.json'
import fr from './locales/fr.json'

const userLocale =
  {
    ru: 'ru',
    fr: 'fr'
  }[window.navigator.language.split('-')[0]] || 'en'

const i18n = createI18n({
  legacy: false,
  locale: userLocale,
  fallbackLocale: 'en',
  messages: {
    ru: { message: ru },
    fr: { message: fr },
    en: { message: en }
  }
})

const app = createApp(App)

app.use(ToastService)
app.use(ConfirmationService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Lara
  }
})
app.use(i18n)
app.directive('tooltip', Tooltip)
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-input-number', InputNumber)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', Message)
app.component('app-textarea', Textarea)
app.component('app-datepicker', DatePicker)
app.component('app-radio-button', RadioButton)
app.component('app-badge', Badge)
app.component('app-chart', Chart)

app.mount('#app')
