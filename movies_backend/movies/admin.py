from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
# Register your models here.
from .models import Lname,Fname,Dynamic,Movie,User,Output,UserPattern

myModels = [Dynamic]
admin.site.register(myModels)

class OutputAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = ('user_id', 'order_no','movie_title','clicked','rec_first_name','rec_last_name','readmore_count')
    def has_add_permission(self, request, obj=None):
        return False
admin.site.register(Output, OutputAdmin)

class FnameAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = ('first_name', 'race','gender')
admin.site.register(Fname, FnameAdmin)

class LnameAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = ('last_name', 'race')
admin.site.register(Lname, LnameAdmin)

class MovieAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = ('title', 'rating','link')
admin.site.register(Movie, MovieAdmin)

class UserAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = ('user_id', 'user_race','user_gender', 'user_age')
    def has_add_permission(self, request, obj=None):
        return False
admin.site.register(User, UserAdmin)

class UserPatternAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = ('user_id','user_names_pattern')
    def has_add_permission(self, request, obj=None):
        return False
admin.site.register(UserPattern, UserPatternAdmin)