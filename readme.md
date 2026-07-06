<p align="center">
  <img src="static/img/logograndesf.png" alt="Logo do IFEED" width="35%">
</p>

<h1 align="center">IFEED - Sistema Web de Feedback Alimentar</h1>

<p align="center">
  Sistema desenvolvido para avaliação, acompanhamento e gestão da alimentação estudantil.
</p>

---

## Sobre o Projeto

O **IFEED** é um sistema web desenvolvido para apoiar o gerenciamento e a avaliação da alimentação estudantil no ambiente escolar.

A proposta do sistema é aproximar os estudantes da gestão do refeitório, permitindo que os alunos avaliem as refeições servidas e que os administradores acompanhem essas informações por meio de relatórios, gráficos e listagens organizadas.

Com isso, o IFEED transforma opiniões dos alunos em dados estruturados, auxiliando na identificação da aceitação das refeições e em possíveis melhorias no serviço de alimentação.

---

## Funcionalidades

### Usuário Aluno

- Cadastro e login no sistema.
- Acesso ao painel do aluno.
- Avaliação de refeições com notas de 1 a 5.
- Envio de comentário opcional sobre a refeição.
- Visualização das avaliações recentes.
- Consulta ao cardápio e aos horários.

### Usuário Administrador

- Acesso a relatórios administrativos.
- Visualização dos feedbacks enviados pelos alunos.
- Gráficos com distribuição de notas, médias e evolução temporal.
- CRUD de usuários.
- CRUD de refeições.
- CRUD de cardápios.
- Busca, filtros e paginação nas listagens.

### Páginas Públicas

- Página inicial.
- Cardápio da semana.
- Página pública de cardápio.
- Detalhes individuais de cada refeição.
- Página de horários.
- Página de contato.

---

## Tecnologias Utilizadas

| Tecnologia | Uso no Projeto |
| :--- | :--- |
| **Python** | Linguagem principal do backend. |
| **Django** | Framework utilizado para rotas, views, models, autenticação e templates. |
| **SQLite** | Banco de dados utilizado no ambiente local. |
| **HTML5** | Estrutura das páginas. |
| **CSS3** | Estilização e responsividade da interface. |
| **JavaScript** | Interatividade das páginas. |
| **Chart.js** | Geração dos gráficos dos relatórios administrativos. |
| **Font Awesome** | Ícones utilizados na interface. |

---

## Estrutura do Projeto

```text
IFEED---Sistema-de-Feedback-Alimentar/
├── core/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── forms.py
│   ├── admin.py
│   └── migrations/
├── ifeed_project/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── cadastro.html
│   ├── aluno.html
│   ├── avaliacao.html
│   ├── cardapio.html
│   ├── refeicao_detalhes.html
│   ├── relatorios.html
│   ├── feedbacks.html
│   └── páginas de CRUD
├── static/
│   ├── estilos/
│   ├── scripts/
│   └── img/
├── manage.py
├── requirements.txt
└── db.sqlite3
```

---

## Models Principais

Os models representam as principais tabelas do banco de dados do sistema.

| Model | Função |
| :--- | :--- |
| `Usuario` | Usuário personalizado do sistema, com matrícula, nome, e-mail, curso, turma e tipo de usuário. |
| `Refeicao` | Refeições cadastradas, com título, descrição, tipo, data e status. |
| `Cardapio` | Agrupa refeições por período, formando o cardápio da semana. |
| `Avaliacao` | Armazena as notas e comentários enviados pelos alunos. |

---

## Como Executar Localmente

Antes de executar o projeto, abra o terminal dentro da pasta principal do sistema, ou seja, a pasta onde está o arquivo `manage.py`.

### Executar no Windows

Crie o ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual:

```bash
venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute as migrações do banco de dados:

```bash
python manage.py migrate
```

Inicie o servidor:

```bash
python manage.py runserver
```

Acesse no navegador:

```text
http://127.0.0.1:8000/
```

### Executar no Linux

Crie o ambiente virtual:

```bash
python3 -m venv venv
```

Ative o ambiente virtual:

```bash
source venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute as migrações do banco de dados:

```bash
python3 manage.py migrate
```

Inicie o servidor:

```bash
python3 manage.py runserver
```

Acesse no navegador:

```text
http://127.0.0.1:8000/
```

Para encerrar o servidor, pressione:

```text
Ctrl + C
```

---

## Rotas Principais

| Página | Rota |
| :--- | :--- |
| Página inicial | `/` |
| Login | `/login/` |
| Cadastro | `/cadastro/` |
| Painel do aluno | `/aluno/` |
| Avaliação | `/avaliacao/` |
| Cardápio público | `/cardapio/` |
| Detalhes da refeição | `/refeicoes/<id>/` |
| Horários | `/horarios/` |
| Relatórios | `/relatorios/` |
| Feedbacks | `/feedbacks/` |
| CRUD de refeições | `/admin-ifeed/refeicoes/` |
| CRUD de cardápios | `/admin-ifeed/cardapios/` |
| CRUD de usuários | `/admin-ifeed/usuarios/` |

---

## Acesso de Teste

Caso esteja usando o banco de dados de exemplo, é possível acessar com:

| Tipo | Informação |
| :--- | :--- |
| Matrícula | `20251198060015` |
| Senha | `123456` |
| Perfil | Administrador |

---
## Status do Projeto

O projeto está funcional e contempla os principais requisitos solicitados:

- Navegação entre telas.
- Banco de dados.
- Autenticação de usuários.
- Permissão de acesso por tipo de usuário.
- CRUD de usuários.
- CRUD de refeições.
- CRUD de cardápios.
- Página pública de cardápio.
- Página de detalhes individuais de refeição.
- Sistema de busca e filtro.
- Paginação.
- Avaliações salvas no banco de dados.
- Relatórios administrativos com gráficos.

---

## Considerações Finais

O IFEED foi desenvolvido com o objetivo de melhorar a comunicação entre os estudantes e a gestão da alimentação escolar.

Através das avaliações, o sistema permite acompanhar a satisfação dos alunos e gerar informações úteis para a melhoria contínua das refeições oferecidas.
