import {createStore, applyMiddleware} from 'redux'
import thunk from 'react-redux'
import reducers from '../reducer/index'

/**
 * 自定义log中间件
 * https://cn.redux.js.org/docs/advanced/Middleware.html
 * @param store
 */
const logger = store => next => action => {
    if (typeof action === 'function') {
        console.log('dispatching a function');
    } else {
        console.log('dispatching ', action);
    }
    const result = next(action);
    console.log('nextState ', store.getState());
    return result;
};

const middlewares = [
    logger,
    thunk
]

// export default createStore(reducers, applyMiddleware(...middlewares))
export default createStore(reducers)