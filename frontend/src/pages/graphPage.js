import React, {useEffect, useState} from 'react'
import { useSearchParams } from "react-router-dom";
import { Plots } from '../components/Plots';

export const GraphPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let query_element = searchParams.get("query")
    let start_date = searchParams.get("start")
    let end_date = searchParams.get("end")

    let [graph_data, setData] = useState([])

    useEffect(()=> {
        getData()
    }, [ query_element, start_date, end_date ])

    let getData = async()=> {       
        let response = await fetch(`/api/weather/dates/?query=${query_element}&start=${start_date}&end=${end_date}`)
        let data = await response.json()  
        setData(data)                      
    }

  return (
    <>
        <div className='card text-center'>
            <div className="card-header">
                <h2>Weather Data</h2>                
            </div>                          
            <div className="card-body">
                <Plots data={graph_data} elem={query_element}/>
            </div>  
        </div>
    </>
  )
}
