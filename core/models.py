from django.core.validators import MaxValueValidator, MinValueValidator
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
    REQUIRED_FIELDS = ['nome_completo', 'email']

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['nome_completo']

    def __str__(self):
        return f"{self.nome_completo} ({self.matricula})"

    @property
    def is_admin_ifeed(self):
        return self.tipo_usuario == 'ADMIN' or self.is_staff or self.is_superuser


class Refeicao(models.Model):
    TIPO_CHOICES = [
        ('CAFE', 'Café da Manhã'),
        ('ALMOCO', 'Almoço'),
        ('LANCHE', 'Lanche da Tarde'),
        ('JANTAR', 'Jantar'),
        ('CEIA', 'Ceia'),
    ]

    titulo = models.CharField('Título', max_length=160)
    descricao = models.TextField('Descrição')
    tipo = models.CharField('Tipo', max_length=20, choices=TIPO_CHOICES)
    data = models.DateField('Data')
    ativo = models.BooleanField('Ativo', default=True)
    criado_em = models.DateTimeField('Criado em', auto_now_add=True)
    atualizado_em = models.DateTimeField('Atualizado em', auto_now=True)

    class Meta:
        verbose_name = 'Refeição'
        verbose_name_plural = 'Refeições'
        ordering = ['data', 'tipo', 'titulo']

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.titulo}"


class Cardapio(models.Model):
    nome = models.CharField('Nome', max_length=160)
    data_inicio = models.DateField('Data inicial')
    data_fim = models.DateField('Data final')
    refeicoes = models.ManyToManyField(Refeicao, related_name='cardapios', blank=True)
    ativo = models.BooleanField('Ativo', default=True)

    class Meta:
        verbose_name = 'Cardápio'
        verbose_name_plural = 'Cardápios'
        ordering = ['-data_inicio']

    def __str__(self):
        return f"{self.nome} ({self.data_inicio:%d/%m/%Y} a {self.data_fim:%d/%m/%Y})"


class Avaliacao(models.Model):
    aluno = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='avaliacoes')
    refeicao = models.CharField('Refeição', max_length=200)
    avaliacao_geral = models.IntegerField(
        'Avaliação Geral',
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    sabor = models.IntegerField('Sabor', validators=[MinValueValidator(1), MaxValueValidator(5)])
    apresentacao = models.IntegerField('Apresentação', validators=[MinValueValidator(1), MaxValueValidator(5)])
    temperatura = models.IntegerField('Temperatura', validators=[MinValueValidator(1), MaxValueValidator(5)])
    quantidade = models.IntegerField('Quantidade', validators=[MinValueValidator(1), MaxValueValidator(5)])
    comentario = models.TextField('Comentário', blank=True)
    data = models.DateTimeField('Data', auto_now_add=True)

    class Meta:
        ordering = ['-data']
        verbose_name = 'Avaliação'
        verbose_name_plural = 'Avaliações'

    def __str__(self):
        return f"{self.aluno.nome_completo} - {self.refeicao} - {self.data.strftime('%d/%m/%Y')}"
