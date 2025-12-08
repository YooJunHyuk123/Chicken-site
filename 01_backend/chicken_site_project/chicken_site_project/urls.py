from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from chicken_site_app import views

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Frontend HTML
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('login.html', TemplateView.as_view(template_name='login.html'), name='login_page'),
    path('sign_up.html', TemplateView.as_view(template_name='sign_up.html'), name='signup_page'),
    path('upload.html', TemplateView.as_view(template_name='upload.html'), name='upload_page'),

    # API
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    # Check login status
    path('user/status/', views.user_status, name='user_status'),

    path('chicken/list/', views.chicken_list, name='chicken_list'),
    path('chicken/create/', views.chicken_create, name='chicken_create'),
    path('chicken/update/<int:chicken_id>/', views.chicken_update, name='chicken_update'),
    path('chicken/delete/<int:chicken_id>/', views.chicken_delete, name='chicken_delete'),
]
