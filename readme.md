<p align="center">
  <img src="static/img/logograndesf.png" alt="Capa do Projeto IFEED" width="35%">
</p>

<h1 align="center"> IFEED - UM SISTEMA WEB PARA FEEDBACK DA ALIMENTAÇÃO ESTUDANTIL</h1>

---

### Sobre o Projeto
O **IFEED** é um sistema digital focado no gerenciamento e feedback da alimentação escolar do Campus Canguaretama. Ele foi idealizado para aproximar os usuários do refeitório institucional, permitindo que alunos e administradores avaliem as refeições, visualizem cardápios e acompanhem relatórios detalhados sobre a aceitação da merenda. O grande diferencial é transformar opiniões em dados estruturados para melhorar continuamente a qualidade do serviço de alimentação oferecido...

---

### Equipe de Desenvolvimento

| Nome | GitHub |
| :--- | :--- |
| **Francislayne Nobre** | [@fraan-dev](https://github.com/fraan-dev) |
| **Maria Lara** | | 
| **Vitória Beniz** | | 
| **Yuri Souza** | | 

---

###  Funcionalidades Principais
* **Painel do Aluno:** Tela interativa para realizar login, realizar o cadastro e enviar feedbacks diários sobre as refeições.
* **Painel do Administrador:** Área restrita para análise de relatórios, acompanhamento gráfico de aceitação e gestão do menu.
* **Sistema de Avaliação:** Interface intuitiva e rápida para classificar os menus servidos.
* **Design Responsivo:** Adaptado tanto para uso em computadores quanto em dispositivos móveis.

---

###  Tecnologias Utilizadas
O projeto utiliza um conjunto de tecnologias modernas para a construção da sua interface e funcionamento:

*  **HTML5** - Estruturação das páginas e componentes visuais de forma modularizada.
*  **CSS3** - Estilização personalizada, layouts modernos e responsividade.
*  **JavaScript** - Comportamentos dinâmicos, validações de formulário e interatividade.
*  **Python / Django Framework** - Gerenciamento de rotas dinâmicas, renderização de templates e lógica de backend.

---

###  Estrutura de Arquivos Atual
A arquitetura base do projeto está organizada utilizando o padrão de arquitetura do Django:

* `templates/` - Centralização de todas as páginas HTML modularizadas (`base.html`, `index.html`, `login.html`, `cadastro.html`, etc).
* `static/estilos/` - Arquivos de estilização visual (`css`).
* `static/scripts/` - Scripts de comportamento e interatividade (`js`).
* `static/img/` - Centralização de logotipos, favicons e elementos visuais do sistema.
* `core/` - Aplicativo responsável pelas regras de negócio, controle de rotas (`urls.py`) e visualizações (`views.py`).
* `ifeed_project/` - Diretório de configuração global do projeto Django.
