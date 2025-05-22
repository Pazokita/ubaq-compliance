import { createApp, h, provide } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./lib/apollo";

const app = createApp({
    setup() {
      provide(DefaultApolloClient, apolloClient)
      return () => h(App)
    }
  })
  
  app.use(router)
  app.mount('#app')
