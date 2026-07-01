from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Avaliacao

class UsuarioAdmin(UserAdmin):
    list_display = ('matricula', 'nome_completo', 'email', 'tipo_usuario', 'curso', 'turma')
    list_filter = ('tipo_usuario', 'curso')
    search_fields = ('matricula', 'nome_completo', 'email')
    ordering = ('matricula',)
    
    fieldsets = (
        (None, {'fields': ('matricula', 'password')}),
        ('Informações Pessoais', {'fields': ('nome_completo', 'email', 'curso', 'turma')}),
        ('Permissões', {'fields': ('tipo_usuario', 'groups', 'user_permissions')}),
        ('Datas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('matricula', 'nome_completo', 'email', 'curso', 'turma', 'tipo_usuario', 'password1', 'password2'),
        }),
    )

class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'refeicao', 'avaliacao_geral', 'data')
    list_filter = ('data', 'avaliacao_geral')
    search_fields = ('aluno__nome_completo', 'refeicao', 'comentario')
    readonly_fields = ('data',)

admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Avaliacao, AvaliacaoAdmin)