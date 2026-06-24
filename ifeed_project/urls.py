from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    
    
    path('assets/<path:path>', RedirectView.as_view(url='/static/assets/%(path)s')),
    path('img/<path:path>', RedirectView.as_view(url='/static/img/%(path)s')),
] + static(settings.STATIC_URL, document_root=settings.BASE_DIR / 'static')