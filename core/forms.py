from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Usuario

class CadastroUsuarioForm(UserCreationForm):
    nome_completo = forms.CharField(max_length=150, label='Nome Completo')
    curso = forms.CharField(max_length=100, label='Curso')
    turma = forms.CharField(max_length=50, label='Turma')
    email_institucional = forms.EmailField(label='E-mail Institucional')
    
    tipo_usuario = forms.ChoiceField(choices=Usuario.TIPO_CHOICES, label='Tipo de Usuário')

    class Meta:
        model = Usuario
        fields = ['matricula', 'nome_completo', 'curso', 'turma', 'email_institucional', 'tipo_usuario']

    
    def clean_email_institucional(self):
        email = self.cleaned_data.get('email_institucional').lower()
        
        
        if not email.endswith('@ifrn.edu.br') and not email.endswith('@escolar.ifrn.edu.br'):
            raise forms.ValidationError("O e-mail deve ser um endereço oficial do IFRN (ex: @ifrn.edu.br).")
            
        
        if Usuario.objects.filter(email_institucional=email).exists():
            raise forms.ValidationError("Este e-mail institucional já está cadastrado.")
            
        return email