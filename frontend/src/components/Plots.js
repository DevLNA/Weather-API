import React from 'react';
import Plot from 'react-plotly.js';

export const Plots = (props) => {  
    let arr =[]
    let dates = []  
    if (props.elem === 'wind_rose'){
      let datax = props.data
      return (
        <Plot data={datax.data} layout={datax.layout}/>
      )
    }  
    else{
      try {
        let datax = Object.values(props.data.result)
        let mean = props.data.mean
        let max = props.data.max
        let min = props.data.min
        if (props.elem !== 'wind_rose'){            
          datax.forEach(element => {
            arr.push(element[props.elem])
          });
    
          //datetime array
          datax.forEach(element => {
            dates.push(element.datetime)
          }); 
        }
        console.log(props.elem)       
          return (
            <>
              <Plot
                data={[
                  {
                    x: dates,
                    y: arr,
                    type: 'scatter',
                    mode: 'lines',
                    marker: {color: 'rgb(55, 128, 191)'},
                  }
                ]}
                layout={{ title: props.elem,
                  shapes: [{
                    type: 'line',
                    x0: dates[dates.length - 1],
                    y0: mean,
                    x1: dates[0],
                    y1: mean,
                    line: {
                      color: 'brown',
                      width: 3,
                      dash: 'dot'
                    }
                  },
                  {
                    type: 'line',
                    x0: dates[dates.length - 1],
                    y0: max,
                    x1: dates[0],
                    y1: max,
                    line: {
                      color: 'brown',
                      width: 1.5,
                      dash: 'dot'
                    }
                  },
                  {
                    type: 'line',
                    x0: dates[dates.length - 1],
                    y0: min,
                    x1: dates[0],
                    y1: min,
                    line: {
                      color: 'brown',
                      width: 1.5,
                      dash: 'dot'
                    }
                  }]                
                }}
                style={{width: '100%', height: '100%'}}
                config={{responsive:true}}
              />  
              </>      
          )
        }
      catch(err){
        console.log()
      }
    }
    
}
