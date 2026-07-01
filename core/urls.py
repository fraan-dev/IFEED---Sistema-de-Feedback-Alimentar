from django.urls import path
from .views import *

urlpatterns = [
    path('', index_view, name='index'), 
    path('login/', login_view, name='login'),
    path('cadastro/', cadastro_view, name='cadastro'),
    path('aluno/', aluno_view, name='aluno'),
    path('avaliar/', avaliar_view, name='avaliar'),
    path('feedbacks/', feedbacks_view, name='feedbacks'),
    path('relatorios/', relatorios_view, name='relatorios'),
]