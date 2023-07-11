**

## Wather API - Pico dos Dias Observatory

**
The Pico dos Dias Observatory is turning it's weather data more accessible.

#### Updates

###### 01/29/2023  Version 1.1

Added Leaf values.

###### 01/29/2023  Version 1.0

This is the first release, containing the data for the main Davis Station located at the top of Perkin-Elmer building.

## API References

#### GET Current Weather

Here the last update that the station uploaded is available.
###### Python Example

    import  requests
    
    api_url = "http://200.131.64.237:8088/api/weather-now/"
    
    response =  requests.**get**(api_url)
    
    response.json()
 
 #### Returns 
*{ "id": 2, "datetime": "2023-01-29T03:15:38Z", "temperature": "20.00", "humidity": "90.00", "wind_speed": "15.00", "wind_dir": "SE", "wind_angle": "100.00", "bar": "321.00", "solar_rad": "4.00", "uv_dose": "2.00", "wind_val": "10-20" }]*

### GET Weather Data between dates

Here you need to pass 3 parameters (query, start and end), for which query parameter indicates what element you want to search.

The list of elements are:  **temperature, humidity, bar, uv_dose, wind_speed, wind_direction, solar_rad, wind_angle**

To get all of them, just use the query  **"all"**

##### Python

    import  requests
    
    api_url = "http://200.131.64.237:8088/api/weather/dates/?query=all&start=2023-01-01T00:00:0.000Z&end=2023-01-29T0:00:00.000Z"
    
    response =  requests.get(api_url)
    
    response.json()

### Returns an object "result" and the mean, max and min values  
*{ "result":[{'id': 2, 'datetime': '2023-01-01T00:00:00Z', 'temperature': '20.00', 'humidity': '90.00', 'wind_speed': '15.00', 'wind_dir': 'SE', 'wind_angle': '100.00', 'bar': '321.00', 'solar_rad': '4.00', 'uv_dose': '2.00', 'wind_val': '10-20'},  
...  
{'id': 1, 'datetime': '2023-01-29T00:00:00Z', 'temperature': '22.60', 'humidity': '78.00', 'wind_speed': '31.00', 'wind_dir': 'NW', 'wind_angle': '231.00', 'bar': '342.00', 'solar_rad': '21.00', 'uv_dose': '2.00', 'wind_val': '30-40'}], "mean": 87.24309052254672, "min": 10.0, "max": 100.0}*
