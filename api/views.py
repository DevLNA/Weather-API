from django.core.files.storage import FileSystemStorage
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Weather
from .serializers import WeatherSerializer
from django_pandas.io import read_frame   # Import django_pandas.io read frame
import plotly.express as px
import plotly
from django.http import HttpResponse
from .simbad import *
import json

from .utils import *
from .solver import PlateSolve
from astropy.io import fits

from astropy.coordinates import SkyCoord
import matplotlib.pyplot as plt
from astropy.visualization import simple_norm
import twirl

import io
import base64
from datetime import datetime

# Create your views here.
@api_view(['GET'])
def apiView(request, dates):
    start_date = request.GET.get('start')
    end_date = request.GET.get('end')
    element = request.GET.get('query')

    if 'wind_rose' in element:
        fields = ['wind_speed', 'wind_dir']
        weather = Weather.objects.values('wind_speed', 'wind_dir', 'wind_val', 'wind_angle').filter(datetime__range=[start_date, end_date]).order_by('-datetime')        
        df = read_frame(weather)            # Transform queryset into pandas dataframe 
        df['wind_angle'] = df['wind_angle'].astype(float)
        grp = df.groupby(["wind_dir","wind_val","wind_angle"]).size()\
                .reset_index(name="frequency").sort_values(['wind_angle'], ascending=[1])
        fig = px.bar_polar(grp, r="frequency", theta="wind_angle",
                    color="wind_val", template="plotly_dark",
                    labels={"Wind-strength": "Wind Speed in Km/h"}, direction='clockwise',
                    color_discrete_sequence= px.colors.sequential.Plasma_r)
        
        graph = plotly.io.to_json(fig, pretty=True)
        #Returns a JSON response so React can convert to plot
        return HttpResponse(graph, content_type="application/json")

    elif 'all' in element:
        weather = Weather.objects.filter(datetime__range=[start_date, end_date]).order_by('-datetime')
        WeatherSerializer.Meta.fields = '__all__'
        serializer = WeatherSerializer(weather, many=True)
        serializer_data = dict()
        serializer_data.update({'result': serializer.data})
        serializer_data.update({'mean': None})
        serializer_data.update({'min': None})
        serializer_data.update({'max': None})

    else:
        fields = ['datetime', element]
        weather = Weather.objects.values('datetime', element).filter(datetime__range=[start_date, end_date]).order_by('-datetime') 
        WeatherSerializer.Meta.fields = fields        
        serializer = WeatherSerializer(weather, many=True)

        if 'wind_dir' in element:
            serializer_data = dict()
            serializer_data.update({'result': serializer.data})
            serializer_data.update({'mean': None})
            serializer_data.update({'min': None})
            serializer_data.update({'max': None})
        else:        
            df = read_frame(weather)
            mean = df[element].mean()
            max = df[element].max()
            min = df[element].min()
            
            serializer_data = dict()
            serializer_data.update({'result': serializer.data})
            serializer_data.update({'mean': mean})
            serializer_data.update({'min': min})
            serializer_data.update({'max': max})        
    
    return Response(serializer_data)

@api_view(['GET'])
def lastWeatherData(request):
    weather = Weather.objects.last()
    WeatherSerializer.Meta.fields = '__all__'
    serializer = WeatherSerializer(weather, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def simbadPlot(request, id):
    arg = id
    response = plot_img(arg)
    # response = jsonify(response)
    
    return HttpResponse(json.dumps(response), content_type="application/json")

@api_view(['GET'])
def getSimbad(request, id):  
    arg = id
    response = simbad_radec(arg)
    
    return HttpResponse(json.dumps(response), content_type="application/json")

@api_view(['POST'])
def solver(request):
    uploaded_file = request.FILES['file']
    file_name = uploaded_file.name
    fov = request.data.get('fov')
    num_stars = request.data.get('numStars')
    ra_target = request.data.get('targetRA')
    dec_target = request.data.get('targetDEC')
    obj = request.data.get('objectName')
    startDate = request.data.get('startDate')
    endDate = request.data.get('endDate')
    step = request.data.get('steps')
    unit = request.data.get('unit')
    unit = unit[0].lower()

    startDate = startDate.split(' (')[0]
    endDate = endDate.split(' (')[0]

    parsed_Startdate = datetime.strptime(startDate, '%a %b %d %Y %H:%M:%S %Z%z')
    parsed_Enddate = datetime.strptime(endDate, '%a %b %d %Y %H:%M:%S %Z%z')

    if obj:
        small_bodies = ephem_horizon(obj, parsed_Startdate.strftime('%Y-%m-%d %H:%M:%S'), 
                                     parsed_Enddate.strftime('%Y-%m-%d %H:%M:%S'), step, unit)
    else:
        small_bodies = None
    
    fs = FileSystemStorage()  # Create a FileSystemStorage instance

    # Save the uploaded file to a specific directory
    filename = fs.save(file_name, uploaded_file)

    # The file path where the file is saved
    file_path = fs.path(filename)

    try:
        plate_solve, hdu = solve_field(file_path) 
        plot_ready = False
    except:
        return HttpResponse(json.dumps({'message:' "Error"}), content_type="application/json")

    while not plate_solve.result: 
        pass
    
    image_base64 = None
    if isinstance(plate_solve.result, tuple):
        ra_center = plate_solve.result[0]
        dec_center = plate_solve.result[1]
        wcs = plate_solve.result[2]
        try:
            txtRASolved = (hours_to_hms(ra_center))
            txtDECSolved = (degrees_to_dms(dec_center))
            if not plot_ready: 
                
                image_base64 = plot_fits(hdu, ra_center, dec_center, wcs, ra_target, dec_target, float(fov), int(num_stars), small_bodies)
                plot_ready = True 
        except Exception as e:
            print(e)
            plate_solve.stop()
    elif isinstance(plate_solve.result, str):
        txtRASolved = ''
        txtDECSolved = ''
    
    response = {
        'image': image_base64,
        'ra_solved': txtRASolved,
        'dec_solved': txtDECSolved,
        'message': 'Figure generated successfully'
    }
    
    return HttpResponse(json.dumps(response), content_type="application/json")

    
def solve_field(file):
    plate_solve = PlateSolve()
    
    plate_solve.fits = file
    plate_solve.folder = None 
    hdu = fits.open(file)[0]
    data = hdu.data
    image_shape = data.shape
    if len(image_shape) == 2:
        h, w = image_shape
    if len(image_shape) == 3:
        x, h, w = image_shape
    plate_solve.pixel_x = w/2
    plate_solve.pixel_y = h/2

    plate_solve.start()

    return plate_solve, hdu

def plot_fits(hdu, ra_center, dec_center, w, ra_target, dec_target, fov, nStars, small_bodies):
    data = hdu.data

    ra, dec = ra_center*15, dec_center
    center = SkyCoord(ra, dec, unit=["deg", "deg"])
    center = [center.ra.value, center.dec.value]

    try:            
        ra_target, dec_target = hms_to_hours(ra_target)*15, dms_to_degrees(dec_target) 
    except:
        ra_target, dec_target = None, None

    data = np.squeeze(data)

    # Create WCS
    wcs = w

    # Create a figure and WCSAxes
    fig = plt.figure(figsize=(8, 8), facecolor='dimgrey')
    
    ax = fig.add_subplot(1, 1, 1, projection=wcs)

    # Display the image
    norm = simple_norm(data, 'linear', percent=99.5)
    ax.imshow(data, norm=norm, origin='lower', cmap="gray")

    # Plot stars and asteroids
    gaias = twirl.gaia_radecs(center, fov/60, limit=nStars)
    gaias_pixel = np.array(SkyCoord(gaias, unit="deg").to_pixel(wcs)).T

    
    if small_bodies:
        for i in range(len(small_bodies[0])):
            ra = (small_bodies[1][i])
            dec = (small_bodies[2][i])
            name = (small_bodies[0][i])
            date_time = (small_bodies[3][i])
            asteroid = np.array(SkyCoord(ra, dec, unit=["deg", "deg"]).to_pixel(wcs)).T
            if i == 0:
                color = 'green'
                ax.annotate(name, asteroid, color='white', xytext=(asteroid[0]+50, asteroid[1]+40),
                    bbox=dict(boxstyle="round", alpha=0.4, color=color), fontsize=10)
            else:
                color = 'red'
                ax.annotate(date_time, asteroid, color='white', xytext=(asteroid[0]+50, asteroid[1]+40),
                    bbox=dict(boxstyle="round", alpha=0.4, color=color), fontsize=10)
            
            ax.plot(*asteroid.T, "o", fillstyle="none", ms=18, color=color)
            # Annotate the asteroids
            # ax.annotate(name, asteroid, color='white', xytext=(asteroid[0]+50, asteroid[1]+40),
            #         bbox=dict(boxstyle="round", alpha=0.4, color=color), fontsize=10)
    
    if ra_target and dec_target:
        target = np.array(SkyCoord(ra_target, dec_target, unit=["deg", "deg"]).to_pixel(wcs)).T
        ax.plot(*target.T, "s", fillstyle="none", ms=18, color="gold")
        # Annotate the targets
        ax.annotate("Target", target, color='white', xytext=(target[0]+50, target[1]+40),
                bbox=dict(boxstyle="round", alpha=0.4, color="gold"), fontsize=10)

    ax.plot(*gaias_pixel.T, "o", fillstyle="none", c="C1", ms=18)
    
    # Set axis labels
    ax.set_xlabel('Right Ascension (J2000)')
    ax.set_ylabel('Declination (J2000)')

    ax.xaxis.label.set_color('white')
    ax.tick_params(axis='x', colors='white')
    ax.yaxis.label.set_color('white')
    ax.tick_params(axis='y', colors='white')

    fig.tight_layout(pad=5)

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    # Encode the image buffer to base64
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')

    # Close the figure to free memory
    plt.close(fig)

    return(image_base64)

    
