# models.py

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

# User table
class User(AbstractUser):
    pass

# Chicken table
class Chicken(models.Model):
    # Foregin key
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chickens')

    # Contents
    image_url = models.CharField(max_length=100)
    brand = models.CharField(max_length=10)
    style = models.CharField(max_length=10)
    name = models.CharField(max_length=10)
    spiciness = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    sweetness = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    crispiness = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    description = models.TextField()

    def __str__(self):
        return f'{self.brand} - {self.style} - {self.name}'