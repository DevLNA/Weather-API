import React from 'react'
import { DocNavbar } from '../components/DocNavbar'

export const Documentation = () => {
  return (
    <main className='d-flex'>
      <DocNavbar/>
      
      <div className="container">
        <br></br>
        <div className='card'>
          <div className='card-header'>
            <h4>API Documentation</h4>
          </div>
          <div className='card-body'>            
            <h2 id='presentation'>Presentation</h2>
            <p>The Pico dos DIas Observatory is turning it's weather data more accessible.</p>
            <h4 id='updates'>Updates</h4>
            <h6><span className="badge bg-secondary">01/29/2023</span> Version 1.0</h6>
            <p>This is the first release, containing the data for the main Davis Station located at the top of Perkin-Elmer building.</p>
            <hr></hr>
            <h2>API References</h2>
            <h4 id='current'>GET Current Weather</h4>
            <p>
              Here the last update that the station uploaded is available.
            </p>
            <div className='card'>
              <div className='card-header'><h6>Python</h6></div>
              <div className='card-body' style={{backgroundColor: 'lightgrey'}}>
                <p><b><span style={{color: 'brown'}}>import</span></b> <span style={{color: 'purple'}}>requests</span></p>
                <p></p>
                <p>api_url = "http://200.131.64.237:8088/api/weather-now/"</p>
                <p>response = <b><span style={{color: 'purple'}}>requests.get</span></b>(api_url)</p>
                <p>response.<b><span style={{color: 'purple'}}>json</span></b>()</p>
                <p style={{color: 'brown'}}>&#123; "id": 2,
                "datetime": "2023-01-29T03:15:38Z", "temperature": "20.00",
                "humidity": "90.00", "wind_speed": "15.00",
                "wind_dir": "SE", "wind_angle": "100.00",
                "bar": "321.00", "solar_rad": "4.00",
                "uv_dose": "2.00", "wind_val": "10-20" &#125;]</p>
              </div>
            </div>
            <br></br>
            <h4 id="specific">GET Weather Data between dates</h4>
            <p>
              Here you need to pass 3 parameters (query, start and end), for which query parameter indicates what element you want to
              search. 
            </p>
            <p>The list of elements are: <b>temperature, humidity, bar, uv_dose, wind_speed, wind_direction, solar_rad, wind_angle </b></p>
            <p id="general">To get all of them, just use the query <b>"all"</b></p>
            <div className='card'>
              <div className='card-header'><h6>Python</h6></div>
              <div className='card-body' style={{backgroundColor: 'lightgrey'}}>
                <p><b><span style={{color: 'brown'}}>import</span></b> <span style={{color: 'purple'}}>requests</span></p>                
                <p>api_url = "http://200.131.64.237:8088/api/weather/dates/?query=all&start=2023-01-01T00:00:0.000Z&end=2023-01-29T0:00:00.000Z"</p>
                <p>response = <b><span style={{color: 'purple'}}>requests.get</span></b>(api_url)</p>
                <p>response.<b><span style={{color: 'purple'}}>json</span></b>()</p>
                #returns an object "result" and the mean, max and min values <br></br>
                <span style={{color: 'brown'}}>&#123; "result":[&#123;'id': 2, 'datetime': '2023-01-01T00:00:00Z', 
                'temperature': '20.00', 'humidity': '90.00', 'wind_speed': '15.00', 'wind_dir': 'SE', 
                'wind_angle': '100.00', 'bar': '321.00', 'solar_rad': '4.00', 'uv_dose': '2.00', 
                'wind_val': '10-20'&#125;,</span><br></br>...<br></br><span style={{color: 'brown'}}> 
                &#123;'id': 1, 'datetime': '2023-01-29T00:00:00Z', 'temperature': '22.60', 'humidity': 
                '78.00', 'wind_speed': '31.00', 'wind_dir': 'NW', 'wind_angle': '231.00', 'bar': '342.00', 
                'solar_rad': '21.00', 'uv_dose': '2.00', 'wind_val': '30-40'&#125;], "mean": 87.24309052254672,
                "min": 10.0, "max": 100.0&#125;</span>
              </div>
            </div>
            <br></br>
            <h4 id="windrose">GET Wind Rose plot</h4>
            <p>This is yet to come.</p>
          </div>
        </div>
      </div>
    </main>
    
  )
}
