from django.urls import path
from . import views

urlpatterns = [
    path('weather/<str:dates>/', view=views.apiView, name='apiview'),
    path('weather-now/', view=views.lastWeatherData, name='weather-now'),
    path('simbad/<str:id>', view=views.simbadPlot, name='simbad-api'),
    path('simbad-ra-dec/<str:id>', view=views.getSimbad, name='simbad-ra-dec-api'),
    path('solve-field/', view=views.solver, name='solver-api')
]
