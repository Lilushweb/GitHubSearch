import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from "@reduxjs/toolkit/query"
import gitHubApi from './gitHubApi'

const store = configureStore({
    reducer: {
        [gitHubApi.reducerPath]: gitHubApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gitHubApi.middleware)
})

setupListeners(store.dispatch)

export default store