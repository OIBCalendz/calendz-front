import { createApp } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'
import { store } from './store'
import { router } from './routes/router'
import DashboardPlugin from './plugins/dashboard-plugin'
import ApiService from './services/api.service'
import ApiCalendarService from './services/api-calendar.service'
// DEPRECATED
// import { VueSpinners } from '@saeris/vue-spinners'
import Vue3TouchEvents from 'vue3-touch-events'
// DEPRECATED
// import VueAnalytics from 'vue-analytics'
import './registerServiceWorker'
import { SidebarStore } from './components/SidebarPlugin'
import Sidebar from './components/SidebarPlugin/SideBar.vue'
import SidebarItem from './components/SidebarPlugin/SidebarItem.vue'

// const isProd = process.env.NODE_ENV === 'production'

// Vue.use(VueSpinners)

// Vue.use(VueAnalytics, {
//   id: 'UA-146470801-1',
//   router,
//   debug: {
//     enabled: !isProd,
//     sendHitTask: isProd
//   }
// })

// Set the base URL of the API
ApiService.init(process.env.VUE_APP_API_URL)
ApiCalendarService.init(process.env.VUE_APP_API_CALENDAR_URL)

export const app = createApp(App)

app.use(router)
app.use(store)
app.use(DashboardPlugin)
app.use(Vue3TouchEvents)

app.config.globalProperties.$sidebar = SidebarStore
app.component('SideBar', Sidebar)
app.component('SidebarItem', SidebarItem)

app.mount('#app')
