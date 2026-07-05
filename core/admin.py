from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Avaliacao, Cardapio, Refeicao, Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('matricula', 'nome_completo', 'email', 'tipo_usuario', 'curso', 'turma', 'is_active')
    list_filter = ('tipo_usuario', 'curso', 'is_active')
    search_fields = ('matricula', 'nome_completo', 'email')
    ordering = ('nome_completo',)

    fieldsets = (
        (None, {'fields': ('matricula', 'password')}),
        ('Informações Pessoais', {'fields': ('nome_completo', 'email', 'curso', 'turma')}),
        ('Permissões', {'fields': ('tipo_usuario', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas importantes', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('matricula', 'nome_completo', 'email', 'curso', 'turma', 'tipo_usuario', 'password1', 'password2'),
        }),
    )


@admin.register(Refeicao)
class RefeicaoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'data', 'ativo')
    list_filter = ('tipo', 'ativo', 'data')
    search_fields = ('titulo', 'descricao')
    date_hierarchy = 'data'


@admin.register(Cardapio)
class CardapioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data_inicio', 'data_fim', 'ativo')
    list_filter = ('ativo', 'data_inicio')
    search_fields = ('nome',)
    filter_horizontal = ('refeicoes',)


@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'refeicao', 'avaliacao_geral', 'data')
    list_filter = ('data', 'avaliacao_geral')
    search_fields = ('aluno__nome_completo', 'refeicao', 'comentario')
    readonly_fields = ('data',)
