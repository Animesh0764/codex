from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

urlpatterns = [
    path('', views.homepage, name='home'),
    path('home/', views.homepage2, name='home2'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_user, name='login'),
    path('profile/', views.profile_page, name='profile_page'),
    path('profile/edit/', views.edit_bio, name='edit_bio'),
    path('logout/', views.logout_user, name='logout'),
    path('connect-leetcode/', views.connect_leetcode, name='connect_leetcode'),
    path('add_friend/', views.add_friend, name='add_friend'),
    path('friend-list/', views.friend_list, name='friend_list'),
    path('friend-stats/<str:friend_username>/', views.friend_stats, name='friend_stats'),
]

urlpatterns += staticfiles_urlpatterns()