import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate  } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

export const Search = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [plotOpt, setPlotOpt] = useState([]);

    var plot_options = [{label: 'Temperature', value: 'temperature'}, {label: 'Humidity', value: 'humidity'}, 
                    {label: 'Wind Speed', value: 'wind_speed'}, {label: 'Wind Direction', value: 'wind_dir'}, 
                    {label: 'Wind Rose', value: 'wind_rose'},{label: 'Pressure', value: 'bar'},
                    {label: 'Solar Radiation', value: 'solar_rad'},{label: 'UV Dose', value: 'uv_dose'}, {label: 'Leaf', value: 'leaf'}]

    let navigate = useNavigate()

     let handleSearch = async(e)=> { 
        e.preventDefault();
        // e.stopPropagation();
        window.location.href = `/weather/dates/?query=${plotOpt}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
        // navigate(`/weather/dates/?query=${plotOpt}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
    }
      
  return (
    <>
    <div className="card text-center">
        <div className="card-header">
            <h4>Search for weather data</h4>
        </div>
        <div className="card-body">
            <form className="row gy-2 gx-3 align-items-center" onSubmit={handleSearch}>
                <div className="col-2">
                </div>
                <div className="col-2">
                    <DatePicker
                    dateFormat="yyyy/MM/dd"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect 
                    className="form-control"/>
                </div>
                <div className="col-2">
                    <DatePicker
                    dateFormat="yyyy/MM/dd"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    showTimeSelect 
                    className="form-control"/>
                </div>     
                <div className="col-3">
                    <select className="form-select" aria-label="Default select example" onChange={(e) => setPlotOpt(e.target.value)}>
                        <option value="0">Variables</option>
                            {plot_options.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                        ))}   
                    </select>
                </div>
                <div className="col-1">
                    <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary"><i className="bi bi-search" style={{fontSize: '20px'}}></i></button>
                    </div>
                </div>                
            </form>
        </div>            
    </div>     
    <br></br> 
    </>
     
    
  );
}
