// Polyfills for js features used in the Dashboard but not supported in some browsers (mainly IE)
import '@/polyfills'

// Notifications plugin. Used on Notifications page
import NotificationPlugin, { NotificationStore } from '@/components/NotificationPlugin'

// A plugin file where you could register global components
import GlobalComponents from './globalComponents'

// A plugin file where you could register global directives
import GlobalDirectives from './globalDirectives'

// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SidebarPlugin, { SidebarStore } from '@/components/SidebarPlugin'

// element ui language configuration
// import lang from 'element-plus/lib/locale/lang/fr'
// import locale from 'element-plus/lib/locale'

// asset imports
import '@/assets/sass/argon.scss'
import '@/assets/css/nucleo/css/nucleo.css'

export default {
  install (app) {
    app.use(GlobalComponents)
    app.use(GlobalDirectives)
    app.use(SidebarStore).use(SidebarPlugin)
    app.use(NotificationStore).use(NotificationPlugin)
  }
}
