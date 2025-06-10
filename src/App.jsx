import './assets/styles.css'
import TypingArea from './TypingArea'
import store from './assets/store'
import { Provider } from 'react-redux'

function App() {
  return(
    <Provider store={store}>
       <TypingArea/>
    </Provider>
   
  )
}

export default App
