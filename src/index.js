import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './store/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, process.env.NODE_ENV == 'development' ? (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) : undefined, applyMiddleware(thunk))

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)
