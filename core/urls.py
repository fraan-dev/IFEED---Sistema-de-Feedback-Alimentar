from django.urls import path

from . import views


urlpatterns = [
    path('', views.index_view, name='index'),
    path('login/', views.login_view, name='login'),
    path('cadastro/', views.cadastro_view, name='cadastro'),
    path('logout/', views.logout_view, name='logout'),
    path('perfil/', views.perfil_view, name='perfil'),
    path('contato/', views.contato_view, name='contato'),
    path('horarios/', views.horarios_view, name='horarios'),

    path('aluno/', views.aluno_view, name='aluno'),
    path('avaliacao/', views.avaliar_view, name='avaliacao'),
    path('avaliar/', views.avaliar_view, name='avaliar_sem_refeicao'),
    path('avaliar/<int:refeicao_id>/', views.avaliar_view, name='avaliar'),

    path('feedbacks/', views.feedbacks_view, name='feedbacks'),
    path('relatorios/', views.relatorios_view, name='relatorios'),

    path('cardapio/', views.cardapio_publico_view, name='cardapio_publico'),
    path('refeicoes/<int:pk>/', views.refeicao_detalhes_view, name='refeicao_detalhes'),

    path('admin-ifeed/refeicoes/', views.refeicao_list_view, name='refeicao_list'),
    path('admin-ifeed/refeicoes/nova/', views.refeicao_form_view, name='refeicao_create'),
    path('admin-ifeed/refeicoes/<int:pk>/editar/', views.refeicao_form_view, name='refeicao_update'),
    path('admin-ifeed/refeicoes/<int:pk>/excluir/', views.refeicao_delete_view, name='refeicao_delete'),

    path('admin-ifeed/cardapios/', views.cardapio_list_view, name='cardapio_list'),
    path('admin-ifeed/cardapios/novo/', views.cardapio_form_view, name='cardapio_create'),
    path('admin-ifeed/cardapios/<int:pk>/editar/', views.cardapio_form_view, name='cardapio_update'),
    path('admin-ifeed/cardapios/<int:pk>/excluir/', views.cardapio_delete_view, name='cardapio_delete'),

    path('admin-ifeed/usuarios/', views.usuario_list_view, name='usuario_list'),
    path('admin-ifeed/usuarios/<str:pk>/editar/', views.usuario_update_view, name='usuario_update'),
    path('admin-ifeed/usuarios/<str:pk>/excluir/', views.usuario_delete_view, name='usuario_delete'),
]
