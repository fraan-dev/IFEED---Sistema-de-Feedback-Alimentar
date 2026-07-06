import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import Avaliacao, Cardapio, Refeicao, Usuario


class Command(BaseCommand):
    help = 'Gera cardápios, refeições e avaliações de exemplo para o IFEED.'

    def handle(self, *args, **options):
        random.seed(20260705)

        alunos = self._criar_alunos()
        refeicoes_por_semana = self._criar_refeicoes_e_cardapios()
        total_avaliacoes = self._criar_avaliacoes(alunos, refeicoes_por_semana)

        self.stdout.write(self.style.SUCCESS('Dados de exemplo gerados com sucesso.'))
        self.stdout.write(f'Alunos disponíveis: {len(alunos)}')
        self.stdout.write(f'Cardápios no banco: {Cardapio.objects.count()}')
        self.stdout.write(f'Refeições no banco: {Refeicao.objects.count()}')
        self.stdout.write(f'Avaliações criadas nesta execução: {total_avaliacoes}')

    def _criar_alunos(self):
        nomes = [
            'Ana Beatriz Silva', 'Bruno Henrique Costa', 'Camila Vitória Souza',
            'Daniel Oliveira Santos', 'Eduarda Ferreira Lima', 'Felipe Araújo Melo',
            'Gabriela Nascimento', 'Henrique Martins Rocha', 'Isadora Alves Moura',
            'João Pedro Ribeiro', 'Karina Gomes Teixeira', 'Lucas Gabriel Freitas',
            'Mariana Lopes Dantas', 'Nicolas Carvalho Reis', 'Olívia Barbosa Nunes',
            'Pedro Miguel Fernandes', 'Rafaela Castro Monteiro', 'Samuel Correia Dias',
            'Thais Cristina Andrade', 'Vinícius Matheus Pereira',
        ]
        alunos = []
        for indice, nome in enumerate(nomes, start=1):
            matricula = f'2026IFEED{indice:03d}'
            aluno, created = Usuario.objects.get_or_create(
                matricula=matricula,
                defaults={
                    'username': matricula,
                    'nome_completo': nome,
                    'curso': random.choice(['Informática', 'Edificações', 'Eletromecânica', 'Administração']),
                    'turma': random.choice(['1º ano A', '1º ano B', '2º ano A', '3º ano B']),
                    'email': f'aluno{indice:03d}@escolar.ifrn.edu.br',
                    'tipo_usuario': 'ALUNO',
                    'is_active': True,
                },
            )
            if created:
                aluno.set_password('ifeed123')
                aluno.save()
            alunos.append(aluno)
        return alunos

    def _criar_refeicoes_e_cardapios(self):
        opcoes = {
            'CAFE': [
                ('Arroz com Frango Desfiado', 'Suco de fruta, melão, banana e melancia.'),
                ('Macarronada de Carne Moída', 'Suco de fruta, banana, melancia e melão.'),
                ('Biscoito Cream Cracker com Queijo', 'Suco de fruta e banana.'),
                ('Bolo de Ovos', 'Suco de fruta, melão e banana.'),
                ('Mingau de Aveia', 'Biscoito cream cracker e banana.'),
                ('Panqueca', 'Suco de fruta, melão, banana e melancia.'),
            ],
            'ALMOCO': [
                ('Carne Guisada', 'Arroz, feijão branco, salada fresca, farofa, suco de fruta e melancia.'),
                ('Frango Assado', 'Arroz, macarrão, feijão verde, farofa, salada fresca, suco de fruta e melancia.'),
                ('Frango Cozido', 'Arroz, feijão preto, salada fresca, farofa, suco de fruta e melancia.'),
                ('Carne Moída', 'Arroz, feijão verde, salada fresca, farofa, suco de fruta e melancia.'),
                ('Carne Guisada', 'Arroz, feijão preto, salada fresca, farofa, suco de fruta e melancia.'),
            ],
            'LANCHE': [
                ('Macarronada de Carne Moída', 'Suco de fruta, banana, melancia e melão.'),
                ('Biscoito Cream Cracker com Queijo', 'Suco de fruta e banana.'),
                ('Bolo de Ovos', 'Suco de fruta, melão e banana.'),
                ('Mingau de Aveia', 'Biscoito cream cracker e banana.'),
                ('Panqueca', 'Suco de fruta, melão, banana e melancia.'),
                ('Arroz com Frango Desfiado', 'Suco de fruta, melão, banana e melancia.'),
            ],
            'JANTAR': [
                ('Frango Assado', 'Arroz, feijão verde, salada fresca, farofa, suco de fruta e melancia.'),
                ('Carne Guisada', 'Arroz, feijão branco, salada fresca, farofa, suco de fruta e melancia.'),
                ('Frango Cozido', 'Arroz, feijão preto, salada fresca, farofa, suco de fruta e melancia.'),
                ('Carne Moída', 'Arroz, feijão verde, salada fresca, farofa, suco de fruta e melancia.'),
                ('Cuscuz com Café', 'Suco de fruta, banana e melão.'),
            ],
        }

        hoje = timezone.localdate()
        segunda_base = hoje - timedelta(days=hoje.weekday())
        refeicoes_por_semana = []

        for semana in range(20):
            inicio = segunda_base + timedelta(days=semana * 7)
            fim = inicio + timedelta(days=4)
            cardapio, _ = Cardapio.objects.update_or_create(
                nome=f'Cardápio IFRN - {inicio:%d/%m} a {fim:%d/%m}',
                defaults={
                    'data_inicio': inicio,
                    'data_fim': fim,
                    'ativo': True,
                },
            )

            refeicoes_semana = []
            for dia in range(5):
                data_refeicao = inicio + timedelta(days=dia)
                for tipo in ['CAFE', 'ALMOCO', 'LANCHE', 'JANTAR']:
                    titulo, descricao = opcoes[tipo][(semana + dia) % len(opcoes[tipo])]
                    refeicao, _ = Refeicao.objects.update_or_create(
                        titulo=titulo,
                        tipo=tipo,
                        data=data_refeicao,
                        defaults={
                            'descricao': descricao,
                            'ativo': True,
                        },
                    )
                    refeicoes_semana.append(refeicao)

            cardapio.refeicoes.set(refeicoes_semana)
            refeicoes_por_semana.extend(refeicoes_semana)

        return refeicoes_por_semana

    def _criar_avaliacoes(self, alunos, refeicoes):
        comentarios = [
            'A refeição estava muito boa e bem servida.',
            'Gostei do sabor, mas poderia estar um pouco mais quente.',
            'A quantidade foi suficiente para o horário.',
            'A salada estava fresca e combinou bem com o prato.',
            'O suco estava bom, só achei um pouco doce.',
            'Gostaria que essa opção aparecesse mais vezes.',
            'Achei a apresentação organizada.',
            'O tempero estava agradável.',
            'A comida estava simples, mas satisfatória.',
            '',
        ]

        Avaliacao.objects.filter(comentario__startswith='[Exemplo IFEED]').delete()
        total = 0
        for _ in range(200):
            refeicao = random.choice(refeicoes)
            nota_base = random.choices([3, 4, 5, 2, 1], weights=[26, 36, 28, 8, 2], k=1)[0]
            comentario = random.choice(comentarios)
            if comentario:
                comentario = f'[Exemplo IFEED] {comentario}'

            Avaliacao.objects.create(
                aluno=random.choice(alunos),
                refeicao=f'{refeicao.get_tipo_display()} - {refeicao.titulo}',
                avaliacao_geral=nota_base,
                sabor=self._nota_proxima(nota_base),
                apresentacao=self._nota_proxima(nota_base),
                temperatura=self._nota_proxima(nota_base),
                quantidade=self._nota_proxima(nota_base),
                comentario=comentario,
            )
            total += 1
        return total

    def _nota_proxima(self, nota):
        return min(5, max(1, nota + random.choice([-1, 0, 0, 1])))
