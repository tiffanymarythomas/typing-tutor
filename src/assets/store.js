import {configureStore} from "@reduxjs/toolkit"
import typingReducer from "./typingslice"

const store=configureStore({
  reducer:typingReducer
})

export default store;