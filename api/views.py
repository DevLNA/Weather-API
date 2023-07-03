from django.shortcuts import render
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

