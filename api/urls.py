from django.urls import path
from . import views

urlpatterns = [
    path('weather/<str:dates>/', view=views.apiView, name='apiview'),
    path('weather-now/', view=views.lastWeatherData, name='weather-now'),
    path('simbad/<str:id>', view=views.simbadPlot, name='simbad-api')
]
