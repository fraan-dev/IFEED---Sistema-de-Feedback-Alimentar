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
    REQUIRED_FIELDS = ['nome_completo']

    def __str__(self):
        return f"{self.nome_completo} ({self.matricula})"
    
    def get_tipo_usuario_display(self):
        return dict(self.TIPO_CHOICES).get(self.tipo_usuario, self.tipo_usuario)


class Avaliacao(models.Model):
    aluno = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='avaliacoes')
    refeicao = models.CharField('Refeição', max_length=200)
    avaliacao_geral = models.IntegerField('Avaliação Geral')
    sabor = models.IntegerField('Sabor')
    apresentacao = models.IntegerField('Apresentação')
    temperatura = models.IntegerField('Temperatura')
    quantidade = models.IntegerField('Quantidade')
    comentario = models.TextField('Comentário', blank=True)
    data = models.DateTimeField('Data', auto_now_add=True)
    
    class Meta:
        ordering = ['-data']
        verbose_name = 'Avaliação'
        verbose_name_plural = 'Avaliações'
    
    def __str__(self):
        return f"{self.aluno.nome_completo} - {self.refeicao} - {self.data.strftime('%d/%m/%Y')}"