# urls.py

from django.contrib import admin
from django.urls import path
from chicken_site_app import views

# URL patterns
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # User
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    # Chicken
    path('chicken/list/', views.chicken_list, name='chicken_list'),
    path('chicken/create/', views.chicken_create, name='chicken_create'),
    path('chicken/update/<int:chicken_id>/', views.chicken_update, name='chicken_update'),
    path('chicken/delete/<int:chicken_id>/', views.chicken_delete, name='chicken_delete'),
]