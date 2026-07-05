from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='usuario',
            options={'ordering': ['nome_completo'], 'verbose_name': 'Usuário', 'verbose_name_plural': 'Usuários'},
        ),
        migrations.CreateModel(
            name='Refeicao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=160, verbose_name='Título')),
                ('descricao', models.TextField(verbose_name='Descrição')),
                ('tipo', models.CharField(choices=[('CAFE', 'Café da Manhã'), ('ALMOCO', 'Almoço'), ('LANCHE', 'Lanche da Tarde'), ('JANTAR', 'Jantar'), ('CEIA', 'Ceia')], max_length=20, verbose_name='Tipo')),
                ('data', models.DateField(verbose_name='Data')),
                ('ativo', models.BooleanField(default=True, verbose_name='Ativo')),
                ('criado_em', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('atualizado_em', models.DateTimeField(auto_now=True, verbose_name='Atualizado em')),
            ],
            options={
                'verbose_name': 'Refeição',
                'verbose_name_plural': 'Refeições',
                'ordering': ['data', 'tipo', 'titulo'],
            },
        ),
        migrations.CreateModel(
            name='Cardapio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=160, verbose_name='Nome')),
                ('data_inicio', models.DateField(verbose_name='Data inicial')),
                ('data_fim', models.DateField(verbose_name='Data final')),
                ('ativo', models.BooleanField(default=True, verbose_name='Ativo')),
                ('refeicoes', models.ManyToManyField(blank=True, related_name='cardapios', to='core.refeicao')),
            ],
            options={
                'verbose_name': 'Cardápio',
                'verbose_name_plural': 'Cardápios',
                'ordering': ['-data_inicio'],
            },
        ),
    ]
