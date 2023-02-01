from django.db import models
import datetime

# Create your models here.
class Weather(models.Model):
    datetime = models.DateTimeField(null=False)
    temperature = models.DecimalField(decimal_places=2, max_digits=5, null=True)
    humidity = models.DecimalField(decimal_places=2, max_digits=5, null=True)
    wind_speed = models.DecimalField(decimal_places=2, max_digits=5, null=True)
    wind_dir = models.CharField(max_length=5, null=True)
    wind_angle = models.DecimalField(decimal_places=2, max_digits=5, null=True)
    bar = models.DecimalField(decimal_places=2, max_digits=5, null=True)
    solar_rad = models.DecimalField(decimal_places=2, max_digits=5, null=True)
    uv_dose = models.DecimalField(decimal_places=2, max_digits=5, null=True)
    wind_val = models.CharField(max_length=10, null=True)

