from astroquery.simbad import Simbad
from matplotlib import pyplot as plt
import matplotlib.transforms as tx
import numpy as np
import math
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import ephem
import datetime
from io import BytesIO
import base64

def hours_to_string(hours, decimal_digits=0):
    """
    Converts Float Hour to string Hour, in format hh:mm:ss:cc
    :param hours: Hours (float)
    """
    if not isinstance(hours, (int, float)):
        raise ValueError("Hours must be a number.")
    
    sign = "-" if hours < 0 else "+"
    hours = abs(hours)
    whole_hours = int(hours)
    fractional_hours = hours - whole_hours

    minutes = int(fractional_hours * 60)
    fractional_minutes = fractional_hours * 60 - minutes

    seconds = int(fractional_minutes * 60)
    fractional_seconds = fractional_minutes * 60 - seconds

    seconds_str = f"{seconds:02}.{int(fractional_seconds * (10 ** decimal_digits)):02d}"

    time_string = f"{sign}{whole_hours:02}:{minutes:02}:{seconds_str}"
    
    return time_string

def get_observer():
    OPD=ephem.Observer()
    OPD.lat='-22.5344'
    OPD.lon='-45.5825'
    OPD.date = datetime.datetime.utcnow()
    OPD.elevation = 1864 # meters
    OPD.horizon = 0 
    return OPD

def string_to_hours(time_string):
    """
    Converts Hours string to float
    :param time_string: Hours String (hh:mm:ss.ss)
    """        
    # Verify separator
    separators = [':', ' ']
    separator = None
    for sep in separators:
        if sep in time_string:
            separator = sep
            break

    if separator is None:
        raise ValueError("Invalid string format. No recognized separator found.")

    components = time_string.split(separator)

    # Check for correct format
    if len(components) != 3:
        raise ValueError(f"Invalid string format. Expected hh{separator}mm{separator}ss.ss")

    hours = abs(int(components[0]))
    minutes = int(components[1])
    seconds = float(components[2])

    total_hours = hours + minutes / 60 + seconds / 3600

    sign = -1 if "-" in time_string else 1
    return sign*total_hours

def string_to_degrees(degrees_string):
    """
    Converts Degrees string to float
    :param degrees_string: Degrees String (dd:mm:ss.ss)
    """
    # Verify separator
    separators = [':', ' ']
    separator = None
    for sep in separators:
        if sep in degrees_string:
            separator = sep
            break

    if separator is None:
        raise ValueError("Invalid string format. No recognized separator found.")

    components = degrees_string.split(separator)

    # Check for correct format
    if len(components) != 3:
        raise ValueError("Invalid string format. Expected dd:mm:ss.ss")

    degrees_int = abs(int(components[0]))
    minutes = int(components[1])    
    seconds = float(components[2])

    degrees = degrees_int + minutes / 60 + seconds / 3600

    sign = -1 if "-" in degrees_string else 1
    return sign*degrees

def get_simbad(id):
    identifier = id  

    result_table = Simbad.query_object(identifier)

    ra = result_table["RA"][0]
    dec = result_table["DEC"][0]

    ra = string_to_hours(ra)
    dec = string_to_degrees(dec)
    print(ra, dec)

    opd = get_observer()
    sidereal_time = opd.sidereal_time()

    sidereal_time = string_to_hours(str(sidereal_time))
    values = [round(x * .5, 1) for x in range(-30, 31)]
    coord = []
    for value in values:
        lst = sidereal_time + value
        if value%2 == 0:
            utcs = opd.date.datetime() + datetime.timedelta(hours=value)
            utcs = utcs.strftime('%H:%M')
        else:
            utcs = ''
        az, elev = get_az_alt(ra, dec, lst, -22.5344)
        xx, yy = pol2cart(90-elev, az, 133)
        coord.append((xx, yy, utcs))
    
    return coord

def get_az_alt(ra, dec, lst, latitude):
    """Convert equatorial coordinates to horizontal"""
    DEG = 180 / math.pi
    RAD = math.pi / 180.0        
    H = (lst-ra) * 15

    #altitude calc
    sinAltitude = (np.sin(dec * RAD)) * (np.sin(latitude * RAD)) + (np.cos(dec * RAD) * np.cos(latitude * RAD) * np.cos(H * RAD))
    elevation = np.arcsin(sinAltitude) * DEG #altura em graus
    
    #azimuth calc
    y = -1 * np.sin(H * RAD)
    x = (np.tan(dec * RAD) * np.cos(latitude * RAD)) - (np.cos(H * RAD) * np.sin(latitude * RAD))

    #Azimuth calc
    azimuth = np.arctan2(y, x) * DEG
    #converting neg values to pos
    
    if (azimuth.any() < 0):
        azimuth = azimuth + 360 
    if isinstance(azimuth, float):
        if (azimuth < 0):
            azimuth = azimuth + 360
    
    return(azimuth,elevation)

def pol2cart(rho, phi, allsky_angle):  
    x = rho * np.cos(np.radians(phi+allsky_angle))
    y = rho * np.sin(np.radians(phi+allsky_angle))
    x0 = 8.5
    y0 = -5
    
    x=3.365*x+x0
    y=3.365*y+y0
    return(x, y)

def get_array_parts(arr):
    first = arr[0]  # First element of the array
    last = arr[-1]  # Last element of the array
    middle = arr[len(arr)//2 - 1:len(arr)//2 + 2]  # Three elements in the middle

    return first, last, middle

def plot_img(id):
    # Get allsky from URL (640x480)
    img = plt.imread(r"C:\Users\teste\Desktop\coopd\public\img\allsky_picole.jpg")
    fig, ax = plt.subplots(figsize=[6, 6])
    tr = tx.Affine2D().rotate_deg(0)
    ax.imshow(img, extent=[-320, 320, -240, 240])

    ax.xaxis.set_visible(False)
    ax.yaxis.set_visible(False)

    # Save
    plt.xlim(-320, 320)
    plt.ylim(-240, 240)    

    coord = get_simbad(id)   
    first, last, middle = get_array_parts(coord)
    x_now, y_now, utc = middle[1]
    if (-280 < x_now < 280) and (-220 < y_now < 220):
        arr_img = plt.imread(r"api\target.png")
        im = OffsetImage(arr_img, zoom=.1)
        ab = AnnotationBbox(im, (x_now, y_now), frameon=False)
        ax.add_artist(ab)

        for i in coord:
            x, y, utcs = i
            if (-280 < x < 280) and (-220 < y < 220):                
                plt.text(x, y, f"*", fontsize=6, color='gold', alpha=.5)
                if utcs:
                    plt.text(x+7, y, f"{utcs}", fontsize=7, color='gold', alpha=.5)
    
    buffer = BytesIO()
    # fig.savefig('skymap_img.png', bbox_inches='tight', transparent=True, dpi=250)

    fig.savefig(buffer, format='png', bbox_inches='tight', pad_inches=0, transparent=True, dpi=250)
    buffer.seek(0)

    # Convert the buffer to a base64-encoded string
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    # Create the API response
    response = {
        'image': image_base64,
        'message': 'Figure generated successfully'
    }

    return response

