import React from 'react'

export const WeatherMaps = () => {
  return (
    <div className='card text-center'>
        <div className="card-header">
                <h4>Useful Maps</h4>               
            </div>
            <br></br>
        <div className="row">
        <div className="col-4">
            <div className="card">
                <div className="card-header">
                    <h5>Wind Radar</h5>
                </div>
                <div className="card-body">
                    <iframe style={{width:"100%",height:"450px",'border-radius':"8px"}} 
                    src="https://embed.windy.com/embed2.html?lat=-22.969&amp;lon=-45.632&amp;detailLat=-22.295
                    &amp;detailLon=-45.786&amp;width=650&amp;height=450&amp;zoom=8&amp;level=surface&amp;overlay=radar
                    &amp;product=radar&amp;menu=&amp;message=true&amp;marker=&amp;calendar=now&amp;pressure=
                    &amp;type=map&amp;location=coordinates&amp;detail=&amp;metricWind=km%2Fh&amp;metricTemp=%C2%B0C
                    &amp;radarRange=-1" frameborder="0"></iframe>
                </div>
            </div>    
        </div>
        <div className="col-4">
            <div className="card">
                <div className="card-header">
                    <h5>Lightning Strikes</h5>
                </div>
                <div className="card-body">
                    <iframe frameborder="0" border="0" cellspacing="0" style={{width:"100%",height:"450px",'border-style':"None"}} 
                    src="https://lxapp.weatherbug.net/v2/lxapp_impl.html?lat=-22.5344&amp;lon=-45.5825&amp;tv=1.8.1" 
                    className="alertsPageView__SparkMapContainer-sc-1npmj08-6 gonsPN"></iframe>

                </div>
            </div>    
        </div>
        <div className="col-4">
            <div className="card">
                <div className="card-header">
                    <h5>GOES 16 Image</h5>
                </div>
                <div className="card-body">
                    <img src="http://200.131.64.237:8090/img/goes_16.png" width="100%" height="400" id="goes16"/>
                </div>
            </div>    
        </div>
    </div>
    </div>
  )
}
