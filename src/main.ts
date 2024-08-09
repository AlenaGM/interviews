import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.scss'

import { initializeApp } from 'firebase/app'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'

import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

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
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', Message)

app.mount('#app')
