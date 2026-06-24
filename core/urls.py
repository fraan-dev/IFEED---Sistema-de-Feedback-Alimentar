from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'), 
    path('login/', views.login_view, name='login'),
    path('cadastro/', views.cadastro_view, name='cadastro'),
    path('aluno/', views.aluno_view, name='aluno'),
    path('avaliar/', views.avaliar_view, name='avaliar'),
    path('feedbacks/', views.feedbacks_view, name='feedbacks'),
    path('relatorios/', views.relatorios_view, name='relatorios'),
]