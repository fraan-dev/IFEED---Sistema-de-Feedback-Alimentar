from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    TIPO_CHOICES = [
        ('ALUNO', 'Aluno'),
        ('ADMIN', 'Administrador'),
    ]

    matricula = models.CharField('Matrícula', max_length=20, primary_key=True)
    nome_completo = models.CharField('Nome Completo', max_length=150)
    curso = models.CharField('Curso', max_length=100)
    turma = models.CharField('Turma', max_length=50)
    email_institucional = models.EmailField('E-mail Institucional', unique=True)
    tipo_usuario = models.CharField('Tipo de Usuário', max_length=10, choices=TIPO_CHOICES, default='ALUNO')

    
    groups = models.ManyToManyField(
        'auth.Group',
        blank=True,
        related_name='usuario_set_custom'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True,
        related_name='usuario_permissions_set_custom'
    )

    USERNAME_FIELD = 'matricula'
    REQUIRED_FIELDS = ['nome_completo', 'email_institucional']

    def __str__(self):
        return f"{self.nome_completo} ({self.matricula})"