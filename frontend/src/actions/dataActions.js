import { DATA_REQUEST, DATA_SUCCESS, DATA_FAIL } from '../constants/dataConstants'
import axios from 'axios'

export const listData = (query_element, start_date, end_date) => async (dispatch) => {
    try {
        dispatch({ type: DATA_REQUEST})
        const { data } = await axios.get(`/api/weather/dates/?query=${query_element}&start=${start_date}&end=${end_date}`)
        dispatch({ type: DATA_SUCCESS, payload: data})
    } catch (error) {
        dispatch({type: DATA_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message})
    }
}