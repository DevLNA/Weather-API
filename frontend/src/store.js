import { configureStore } from '@reduxjs/toolkit'
import { dataReducers } from './reducers/dataReducers'

const store = configureStore({reducer: {
    dataList: dataReducers,
}})

export default store