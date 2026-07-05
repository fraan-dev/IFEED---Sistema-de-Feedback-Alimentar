# Relatório de Correções - IFEED

## Resumo

O projeto foi revisado para corrigir inconsistências entre models, views, URLs, templates, JavaScript e autenticação. 

## Erros encontrados

- `views.py` não possuía todas as funções referenciadas nas URLs.
- `ifeed_project/urls.py` duplicava rotas do app em vez de incluir `core.urls`.
- Havia incompatibilidade entre os nomes de rota `avaliar` e `avaliacao`.
- `feedbacks.html` e `relatorios.html` dependiam de dados mockados no JavaScript.
- `aluno.js` ainda usava `localStorage` e podia sobrescrever avaliações salvas no banco.
- Havia referência conceitual a `Refeicao` e `Cardapio`, mas os models não existiam.
- `forms.py` estava limitado ao cadastro e não atendia CRUDs administrativos.
- `admin.py` registrava apenas `Usuario` e `Avaliacao`.
- O menu tinha link de perfil sem rota funcional.
- Mensagens de sucesso/erro estavam duplicadas entre templates e `base.html`.
- Faltavam páginas de perfil, contato, cardápio público, detalhes de refeição e CRUDs.

## Alterações realizadas

- Adicionados models `Refeicao` e `Cardapio`.
- Mantido `Avaliacao.refeicao` como texto para preservar compatibilidade com o banco existente.
- Criada migração `0002_refeicao_cardapio.py`.
- Reorganizadas as views em `core/views.py`.
- Adicionadas permissões para áreas administrativas.
- Corrigido login por matrícula ou e-mail.
- Corrigido cadastro para criar usuário aluno por padrão.
- Corrigido redirecionamento de admin para relatórios.
- Corrigidas URLs no `core/urls.py`.
- Corrigido `ifeed_project/urls.py` para usar `include('core.urls')`.
- Adicionadas rotas públicas de cardápio e detalhes de refeição.
- Adicionados CRUDs de refeições, cardápios e usuários.
- Ajustados feedbacks e relatórios para usarem dados reais do banco.
- Substituído `admin.js` para consumir dados reais via `json_script`.
- Limpo `aluno.js` para remover dependência de `localStorage`.
- Adicionadas páginas `perfil.html`, `contato.html`, `cardapio.html`, `refeicao_detalhes.html` e templates de CRUD.
- Adicionado `requirements.txt`.

## Como executar

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Depois acesse:

- Página inicial: `http://127.0.0.1:8000/`
- Login: `http://127.0.0.1:8000/login/`
- Área do aluno: `http://127.0.0.1:8000/aluno/`
- Avaliação: `http://127.0.0.1:8000/avaliacao/`
- Cardápio público: `http://127.0.0.1:8000/cardapio/`
- Admin Django: `http://127.0.0.1:8000/admin/`
- Relatórios: `http://127.0.0.1:8000/relatorios/`
- Feedbacks: `http://127.0.0.1:8000/feedbacks/`

## Validação feita

- Sintaxe Python verificada com `py_compile`.
- Nomes de rotas usados nos templates conferidos contra `core/urls.py`.
- Busca textual confirmou remoção de `localStorage`, `sessionStorage`, mocks e nomes antigos problemáticos.

Observação: `python manage.py check` não pôde ser executado neste ambiente porque o Django não está instalado aqui. O arquivo `requirements.txt` foi adicionado para instalação no ambiente local.
