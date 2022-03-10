from django.conf.urls import url
from django.contrib import admin
from django.urls import path
from movies import views
from django.views.generic.base import RedirectView

urlpatterns = [
    url(r'^$', views.index, name='home'),
    url(r'^admin/', admin.site.urls),
    url(r'^getuserid/',views.getUserID),
    url(r'^postip',views.postIP),
    url(r'^postuserinfo',views.postUserInfo),
    url(r'^postnewuser',views.postNewUser),
    url(r'^postusertesttype',views.postUserTestType),
    url(r'^postsurvey',views.postSurveyData),
    url(r'^postfeedback',views.postFeedbackData),
    url(r'^postmovielink',views.postMovieLink),
    url(r'^getnames/',views.getNames),
    url(r'^getmovies/',views.getMovies),
    url(r'^getfaces/',views.getFaces),
    url(r'^getmoviescount/',views.getMoviesCount),
    url(r'^getfnamescount/',views.getFNamesCount),
    url(r'^getdynamics/',views.getDynamics),
    path("getimage/<data>/",views.getImage, name="data"),
    url(r'^createfnames/',views.createFnames),
    url(r'^createlnames/',views.createLnames),
    url(r'^createmovies/',views.createMovies),
    url(r'^createupdatedmovies/',views.createUpdatedMovies),
    url(r'testmodel',views.testModel),
    url(r'^.*$', RedirectView.as_view(url='/', permanent=False), name='index')
]
