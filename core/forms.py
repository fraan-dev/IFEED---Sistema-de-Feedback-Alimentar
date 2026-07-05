from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import Cardapio, Refeicao, Usuario


class CadastroUsuarioForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = ['matricula', 'nome_completo', 'curso', 'turma', 'email', 'tipo_usuario']

    def clean_email(self):
        email = (self.cleaned_data.get('email') or '').strip().lower()
        if not email.endswith('@ifrn.edu.br') and not email.endswith('@escolar.ifrn.edu.br'):
            raise forms.ValidationError('O e-mail deve ser um endereço oficial do IFRN.')
        if Usuario.objects.filter(email=email).exists():
            raise forms.ValidationError('Este e-mail já está cadastrado.')
        return email

    def save(self, commit=True):
        usuario = super().save(commit=False)
        usuario.username = usuario.matricula
        usuario.email = usuario.email.lower()
        usuario.is_staff = usuario.tipo_usuario == 'ADMIN'
        if commit:
            usuario.save()
        return usuario


class UsuarioFormEdicao(UserChangeForm):
    password = None

    class Meta:
        model = Usuario
        fields = ['nome_completo', 'email', 'curso', 'turma', 'tipo_usuario', 'is_active']


class RefeicaoForm(forms.ModelForm):
    class Meta:
        model = Refeicao
        fields = ['titulo', 'descricao', 'tipo', 'data', 'ativo']
        widgets = {
            'data': forms.DateInput(attrs={'type': 'date'}),
            'descricao': forms.Textarea(attrs={'rows': 4}),
        }


class CardapioForm(forms.ModelForm):
    class Meta:
        model = Cardapio
        fields = ['nome', 'data_inicio', 'data_fim', 'refeicoes', 'ativo']
        widgets = {
            'data_inicio': forms.DateInput(attrs={'type': 'date'}),
            'data_fim': forms.DateInput(attrs={'type': 'date'}),
            'refeicoes': forms.CheckboxSelectMultiple(),
        }
