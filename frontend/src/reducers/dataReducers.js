import { DATA_REQUEST, DATA_SUCCESS, DATA_FAIL } from '../constants/dataConstants'

export const dataReducers = (state = {data: []}, action) => {
    switch(action.type){
        case DATA_REQUEST:
            return { loading: true, ...state}
        case DATA_SUCCESS:
            return { loading: false, data: action.payload}
        case DATA_FAIL:
            return { loading: false, error: action.payload}
        default:
            return state
    }
}