import React, {useEffect, useState} from 'react'
import { useSearchParams } from "react-router-dom";
import { Plots } from '../components/Plots';
import { useDispatch, useSelector } from 'react-redux'
import { listData } from '../actions/dataActions'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'

export const GraphPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let query_element = searchParams.get("query")
    let start_date = searchParams.get("start")
    let end_date = searchParams.get("end")    

    const dispatch = useDispatch()
    const dataList = useSelector(state => state.dataList)
    const { error, loading, data } = dataList

    useEffect(() => {      
        dispatch(listData(query_element, start_date, end_date))
    }, [dispatch])


  return (
    <>
        <div className='card text-center'>
            <div className="card-header">
                <h2>Weather Data</h2>                
            </div>  
            {
                loading ? <Loader/> 
                : error ? <Message variant='danger'>{error}</Message> 
                : <div className="card-body">
                    <Plots data={data} elem={query_element}/>
                </div> 
            }                        
             
        </div>
    </>
  )
}
