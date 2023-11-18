import React, { useState } from 'react';
import { Loader } from '../components/Loader'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'

export const SolverPage = () => {
    
  const [file, setFile] = useState(null);
  const [targetSimbad, setTargetSimbad] = useState('');
  const [targetRA, setTargetRA] = useState('');
  const [targetDec, setTargetDec] = useState('');
  const [fov, setFov] = useState('');
  const [numStars, setNumStars] = useState('');
  const [objectName, setObjectName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [steps, setSteps] = useState(1);
  const [unit, setUnit] = useState('days');
  const [loading, setLoading] = useState(false);
  const [image64, setImage64] = useState('');

  const handleFileChange = (e) => {
    // Handle file upload logic here
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/simbad-ra-dec/${targetSimbad}`);
      const data = await response.json();

      // Assuming the API returns data in the format { targetRA: 'value', targetDec: 'value' }
      setTargetRA(data[0]);
      setTargetDec(data[1]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fov', fov);
    formData.append('numStars', numStars);
    formData.append('targetSimbad', targetSimbad);
    formData.append('targetRA', targetRA);
    formData.append('targetDec', targetDec);
    formData.append('objectName', objectName);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('steps', steps);
    formData.append('unit', unit);
    setLoading(true);
    let response;
    try {
      response = await axios.post('/api/solve-field/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set proper headers for file upload
        },
      });

      if (response.status === 200) {
        // Handle success
        const ra_solved = response.data.ra_solved;
        const dec_solved = response.data.dec_solved;
        const raEle = document.getElementById('raSolved');
        const decEle = document.getElementById('decSolved');
        raEle.value = ra_solved;
        decEle.value = dec_solved;
        
      } else {
        // Handle error
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Deactivate loader after operation completes
      const imageBase64 = response.data.image;
      setImage64(`data:image/png;base64, ${imageBase64}`);
        // const imgElement = document.getElementById('myImage');
        // imgElement.src = `data:image/png;base64, ${imageBase64}`;
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-header">
              <h4>Pico dos Dias Observatory Helper</h4>
            </div>
            <div className="card-body">
              <form className="row gy-2 gx-3 align-items-center" onSubmit={handleSubmit}>
              <div>
                    <label htmlFor="file">FITS upload:</label>
                    <input type="file" id="file" accept=".fits" onChange={handleFileChange} required/>
                </div>
              <div className="card mb-3">                
                  <div className="card-header"><b>Image Info</b></div>
                  <div className="card-body">
                    <div className='row'>
                        <div className='col-6'>
                            <label htmlFor="fov" style={{ paddingRight: '10px' }}>FOV (arcmin):</label>
                            <input type="text" id="fov" value={fov} onChange={(e) => setFov(e.target.value)} style={{ marginLeft: '10px' }} required/>
                        </div>
                        <div className='col-6'>
                            <label htmlFor="numStars" style={{ paddingRight: '10px' }}>N of Stars:</label>
                            <input 
                                type="number" 
                                id="numStars" 
                                value={numStars} 
                                onChange={(e) => {
                                    const enteredValue = e.target.value;
                                    if (enteredValue > 1) {
                                        setNumStars(enteredValue);
                                    } else {
                                        setNumStars(1); // Reset to 1 or display an error message
                                    }
                                }} 
                                style={{ marginLeft: '10px' }} 
                            required/>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-header"><b>Target Coordinates J2000</b></div>
                  <div className="card-body">
                    
                    <div className='row'>
                        <div className='col-4'>
                            <label htmlFor="targetSimbad">SIMBAD ID:</label>
                            <input type="text" id="targetSimbad" value={targetSimbad} onChange={(e) => setTargetSimbad(e.target.value)} />
                            <input type="button" className="btn btn-success" onClick={handleSearch} value="Search"/>                            
                        </div>
                        <div className='col-4'>
                            <label htmlFor="targetRA">Target RA:</label>
                            <input type="text" id="targetRA" value={targetRA} onChange={(e) => setTargetRA(e.target.value)} />
                        </div>
                        <div className='col-4'>
                            <label htmlFor="targetDec">Target Dec:</label>
                            <input type="text" id="targetDec" value={targetDec} onChange={(e) => setTargetDec(e.target.value)} />
                        </div>
                    </div>            
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-header"><b>Transit and Occultations</b></div>
                  <div className="card-body">
                    <div>
                      <label htmlFor="objectName" style={{ paddingRight: '10px' }}>Object Name: </label>
                      <input type="text" id="objectName" value={objectName} onChange={(e) => setObjectName(e.target.value)} />
                    </div>
                    <div className='row'>
                        <div className='col-4'>
                            <label htmlFor="startDate">Start Date:</label>
                            <DatePicker id='startDate'
                                dateFormat="yyyy-MM-dd hh:mm:ss"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                showTimeSelect 
                                className="form-control"/>
                        </div> 
                        <div className='col-4'>
                            <label htmlFor="endDate">End Date:</label>
                            <DatePicker id='endDate'
                                dateFormat="yyyy-MM-dd hh:mm:ss"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                showTimeSelect 
                                className="form-control"/>
                        </div>   
                        <div className='col-4'>                      
                            <label>Step Size: </label><br></br>
                            <input type="number" id="steps" value={steps} onChange={(e) => setSteps(e.target.value)} style={{ width: '50px' }} />
                            <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                                <option value="days">Days</option>
                                <option value="hours">Hours</option>
                                <option value="minutes">Minutes</option>
                            </select>
                        </div>                   
                    </div>                    
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px' }}>
                    <i className="bi bi-crosshair" style={{ fontSize: '20px' }}></i> Solve
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
            {loading ? <Loader/> 
            : image64 ? <img src={image64} id="myImage" className="img-fluid" alt="Image description" />
            : 
            <div>
                <h3>Resolving the Field</h3>
                <p>This tool was developed to locate specific objects and project trajectories of celestial bodies within images.</p>
                <h4>Loading the FITS Image</h4>
                <p>In the interface, input the FITS image you wish to analyze.</p>
                <h4>Astronomical Field Resolution</h4>
                <p>You need to provide the Field of View of the Image you are going to analyze. Number of stars is just for matching visualization. 
                    The system will automatically resolve the astronomical field, identifying stars and other celestial bodies.
                    The object's position will be marked on the image, allowing for easy identification among various elements.</p>
                <h4>Star Identification</h4>
                <p>use the "Target" fields to input coordinates of a specific star. 
                    The tool will identify and pinpoint the exact position of the star within the astronomical field.
                    <b>You can either insert manually the coordinates or use SIMBAD search to get its coordinates automatically.</b></p>
                <h4>Using Ephemerides and Trajectory Projection</h4>
                <p>Utilize Horizon's ephemerides to track and project the trajectory of small bodies onto the image.
                    It offers the option to project the trajectory in days, minutes, or hours for detailed analysis.</p>
                    <hr></hr>
                <p>Any problems or suggestions, report to <b>rgargalhone@lna.br</b></p>
            </div>
            } 
            <br></br>
            <label><b>SOLVER RESULT (COORDINATES AT CENTER OF IMAGE)</b></label>
            <hr></hr>
            <label htmlFor="raSolved" style={{ paddingRight: '10px' }}><b>RA: </b></label>
            <input type="text" id="raSolved" style={{ marginRight: '10px' }} /> 
            <label htmlFor="decSolved" style={{ paddingRight: '10px' }}><b>DEC: </b></label>
            <input type="text" id="decSolved" style={{ marginRight: '10px' }} />         
        </div>
      </div>
    </div>
  );
};

