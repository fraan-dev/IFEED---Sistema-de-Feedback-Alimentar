from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Avg, Count, Q
from django.db.models.functions import TruncDate
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone

from .forms import CardapioForm, RefeicaoForm, UsuarioFormEdicao
from .models import Avaliacao, Cardapio, Refeicao, Usuario


def usuario_e_admin(usuario):
    return (
        usuario.is_authenticated
        and (usuario.tipo_usuario == 'ADMIN' or usuario.is_staff or usuario.is_superuser)
    )


def admin_required(view_func):
    @login_required
    def wrapper(request, *args, **kwargs):
        if not usuario_e_admin(request.user):
            messages.error(request, 'Você não tem permissão para acessar essa página.')
            return redirect('aluno')
        return view_func(request, *args, **kwargs)

    return wrapper


def index_view(request):
    hoje = timezone.localdate()
    cardapios = Cardapio.objects.filter(ativo=True, data_fim__gte=hoje).prefetch_related('refeicoes')[:2]
    return render(request, 'index.html', {'cardapios': cardapios})


def login_view(request):
    if request.method == 'POST':
        login_input = request.POST.get('login', '').strip()
        senha = request.POST.get('senha')

        try:
            if '@' in login_input:
                usuario_encontrado = Usuario.objects.get(email__iexact=login_input)
            else:
                usuario_encontrado = Usuario.objects.get(matricula=login_input)
        except Usuario.DoesNotExist:
            messages.error(request, 'Usuário não encontrado!')
            return render(request, 'login.html')

        usuario = authenticate(
            request,
            username=usuario_encontrado.matricula,
            password=senha
        )

        if usuario is not None:
            login(request, usuario)
            messages.success(request, f'Bem-vindo(a), {usuario.nome_completo}!')

            if usuario_e_admin(usuario):
                return redirect('relatorios')
            return redirect('aluno')

        messages.error(request, 'Senha incorreta!')

    return render(request, 'login.html')


def cadastro_view(request):
    if request.method == 'POST':
        matricula = (request.POST.get('matricula') or '').strip()
        nome_completo = (request.POST.get('nome') or '').strip()
        curso = (request.POST.get('curso') or '').strip()
        turma = (request.POST.get('turma') or '').strip()
        email = (request.POST.get('email') or '').strip().lower()
        senha = request.POST.get('senha') or ''
        confirmar_senha = request.POST.get('confirmarSenha') or ''
        tipo_usuario = request.POST.get('tipoUsuario', 'aluno')

        if senha != confirmar_senha:
            messages.error(request, 'As senhas não coincidem.')
            return render(request, 'cadastro.html')
        if len(senha) < 6:
            messages.error(request, 'A senha deve ter pelo menos 6 caracteres.')
            return render(request, 'cadastro.html')
        if Usuario.objects.filter(matricula=matricula).exists():
            messages.error(request, 'Matrícula já cadastrada!')
            return render(request, 'cadastro.html')
        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'E-mail já cadastrado!')
            return render(request, 'cadastro.html')

        usuario = Usuario(
            matricula=matricula,
            nome_completo=nome_completo,
            curso=curso,
            turma=turma,
            email=email,
            username=matricula,
            tipo_usuario='ADMIN' if tipo_usuario == 'administrador' else 'ALUNO',
            is_staff=tipo_usuario == 'administrador',
        )
        usuario.set_password(senha)
        usuario.save()

        messages.success(request, 'Cadastro realizado com sucesso! Faça login.')
        return redirect('login')

    return render(request, 'cadastro.html')


def logout_view(request):
    logout(request)
    messages.success(request, 'Você saiu da conta.')
    return redirect('login')


@login_required
def perfil_view(request):
    return render(request, 'perfil.html')


def contato_view(request):
    return render(request, 'contato.html')


@login_required
def aluno_view(request):
    minhas_avaliacoes = Avaliacao.objects.filter(aluno=request.user).order_by('-data')
    return render(request, 'aluno.html', {
        'minhas_avaliacoes': minhas_avaliacoes,
    })


@login_required
def avaliar_view(request, refeicao_id=None):
    refeicao_obj = get_object_or_404(Refeicao, id=refeicao_id, ativo=True) if refeicao_id else None

    if request.method == 'POST':
        refeicao_nome = request.POST.get('refeicao_nome') or request.POST.get('refeicao') or ''
        if refeicao_obj:
            refeicao_nome = str(refeicao_obj)

        avaliacao_geral = request.POST.get('avaliacao_geral')
        sabor = request.POST.get('sabor')
        apresentacao = request.POST.get('apresentacao')
        temperatura = request.POST.get('temperatura')
        quantidade = request.POST.get('quantidade')
        comentario = request.POST.get('comentario', '')

        if not refeicao_nome:
            messages.error(request, 'Selecione a refeição avaliada.')
            return render(request, 'avaliacao.html', {'refeicao': refeicao_obj})
        if not all([avaliacao_geral, sabor, apresentacao, temperatura, quantidade]):
            messages.error(request, 'Avalie todos os itens antes de enviar.')
            return render(request, 'avaliacao.html', {'refeicao': refeicao_obj})

        Avaliacao.objects.create(
            aluno=request.user,
            refeicao=refeicao_nome,
            avaliacao_geral=avaliacao_geral,
            sabor=sabor,
            apresentacao=apresentacao,
            temperatura=temperatura,
            quantidade=quantidade,
            comentario=comentario,
        )

        messages.success(request, 'Avaliação enviada com sucesso!')
        return redirect('aluno')

    return render(request, 'avaliacao.html', {'refeicao': refeicao_obj})


@admin_required
def feedbacks_view(request):
    termo = (request.GET.get('q') or '').strip()
    nota = request.GET.get('nota') or ''
    avaliacoes = Avaliacao.objects.select_related('aluno').order_by('-data')

    if termo:
        avaliacoes = avaliacoes.filter(
            Q(aluno__nome_completo__icontains=termo)
            | Q(aluno__matricula__icontains=termo)
            | Q(refeicao__icontains=termo)
            | Q(comentario__icontains=termo)
        )
    if nota:
        avaliacoes = avaliacoes.filter(avaliacao_geral=nota)

    paginator = Paginator(avaliacoes, 10)
    page_obj = paginator.get_page(request.GET.get('page'))
    return render(request, 'feedbacks.html', {
        'page_obj': page_obj,
        'avaliacoes': page_obj.object_list,
        'total_avaliacoes': avaliacoes.count(),
        'termo': termo,
        'nota': nota,
    })


@admin_required
def relatorios_view(request):
    avaliacoes = Avaliacao.objects.all()
    medias = avaliacoes.aggregate(
        geral=Avg('avaliacao_geral'),
        sabor=Avg('sabor'),
        apresentacao=Avg('apresentacao'),
        temperatura=Avg('temperatura'),
        quantidade=Avg('quantidade'),
    )

    por_refeicao = list(
        avaliacoes.values('refeicao')
        .annotate(total=Count('id'))
        .order_by('refeicao')
    )
    por_data = list(
        avaliacoes.annotate(dia=TruncDate('data'))
        .values('dia')
        .annotate(media=Avg('avaliacao_geral'))
        .order_by('dia')
    )
    chart_data = {
        'distribuicao': [avaliacoes.filter(avaliacao_geral=nota).count() for nota in range(1, 6)],
        'categorias': [
            round(medias['sabor'] or 0, 1),
            round(medias['apresentacao'] or 0, 1),
            round(medias['temperatura'] or 0, 1),
            round(medias['quantidade'] or 0, 1),
        ],
        'refeicoesLabels': [item['refeicao'] for item in por_refeicao],
        'refeicoesValores': [item['total'] for item in por_refeicao],
        'timelineLabels': [item['dia'].strftime('%d/%m') for item in por_data if item['dia']],
        'timelineValores': [round(item['media'] or 0, 1) for item in por_data if item['dia']],
    }

    return render(request, 'relatorios.html', {
        'total_avaliacoes': avaliacoes.count(),
        'medias': medias,
        'chart_data': chart_data,
    })


def cardapio_publico_view(request):
    hoje = timezone.localdate()
    termo = (request.GET.get('q') or '').strip()
    tipo = request.GET.get('tipo') or ''
    refeicoes = Refeicao.objects.filter(ativo=True, data__gte=hoje)

    if termo:
        refeicoes = refeicoes.filter(Q(titulo__icontains=termo) | Q(descricao__icontains=termo))
    if tipo:
        refeicoes = refeicoes.filter(tipo=tipo)

    paginator = Paginator(refeicoes.order_by('data', 'tipo'), 9)
    return render(request, 'cardapio.html', {
        'page_obj': paginator.get_page(request.GET.get('page')),
        'tipos_refeicao': Refeicao.TIPO_CHOICES,
        'termo': termo,
        'tipo': tipo,
    })


def refeicao_detalhes_view(request, pk):
    refeicao = get_object_or_404(Refeicao, pk=pk, ativo=True)
    avaliacoes = Avaliacao.objects.filter(refeicao__icontains=refeicao.titulo)[:10]
    return render(request, 'refeicao_detalhes.html', {
        'refeicao': refeicao,
        'avaliacoes': avaliacoes,
    })


@admin_required
def refeicao_list_view(request):
    termo = (request.GET.get('q') or '').strip()
    refeicoes = Refeicao.objects.all()
    if termo:
        refeicoes = refeicoes.filter(Q(titulo__icontains=termo) | Q(descricao__icontains=termo))
    paginator = Paginator(refeicoes, 10)
    return render(request, 'crud_refeicoes.html', {
        'page_obj': paginator.get_page(request.GET.get('page')),
        'termo': termo,
    })


@admin_required
def refeicao_form_view(request, pk=None):
    refeicao = get_object_or_404(Refeicao, pk=pk) if pk else None
    form = RefeicaoForm(request.POST or None, instance=refeicao)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Refeição salva com sucesso!')
        return redirect('refeicao_list')
    return render(request, 'form_refeicao.html', {'form': form, 'refeicao': refeicao})


@admin_required
def refeicao_delete_view(request, pk):
    refeicao = get_object_or_404(Refeicao, pk=pk)
    if request.method == 'POST':
        refeicao.delete()
        messages.success(request, 'Refeição excluída com sucesso!')
        return redirect('refeicao_list')
    return render(request, 'confirmar_exclusao.html', {
        'objeto': refeicao,
        'voltar_url': reverse('refeicao_list'),
    })


@admin_required
def usuario_list_view(request):
    termo = (request.GET.get('q') or '').strip()
    usuarios = Usuario.objects.all()
    if termo:
        usuarios = usuarios.filter(
            Q(nome_completo__icontains=termo)
            | Q(matricula__icontains=termo)
            | Q(email__icontains=termo)
        )
    paginator = Paginator(usuarios, 10)
    return render(request, 'crud_usuarios.html', {
        'page_obj': paginator.get_page(request.GET.get('page')),
        'termo': termo,
    })


@admin_required
def usuario_update_view(request, pk):
    usuario = get_object_or_404(Usuario, pk=pk)
    form = UsuarioFormEdicao(request.POST or None, instance=usuario)
    if request.method == 'POST' and form.is_valid():
        usuario = form.save(commit=False)
        usuario.is_staff = usuario.tipo_usuario == 'ADMIN'
        usuario.save()
        messages.success(request, 'Usuário atualizado com sucesso!')
        return redirect('usuario_list')
    return render(request, 'form_usuario.html', {'form': form, 'usuario': usuario})


@admin_required
def usuario_delete_view(request, pk):
    usuario = get_object_or_404(Usuario, pk=pk)
    if request.method == 'POST':
        usuario.delete()
        messages.success(request, 'Usuário excluído com sucesso!')
        return redirect('usuario_list')
    return render(request, 'confirmar_exclusao.html', {
        'objeto': usuario,
        'voltar_url': reverse('usuario_list'),
    })


@admin_required
def cardapio_list_view(request):
    cardapios = Cardapio.objects.prefetch_related('refeicoes')
    paginator = Paginator(cardapios, 10)
    return render(request, 'crud_cardapios.html', {
        'page_obj': paginator.get_page(request.GET.get('page')),
    })


@admin_required
def cardapio_form_view(request, pk=None):
    cardapio = get_object_or_404(Cardapio, pk=pk) if pk else None
    form = CardapioForm(request.POST or None, instance=cardapio)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Cardápio salvo com sucesso!')
        return redirect('cardapio_list')
    return render(request, 'form_cardapio.html', {'form': form, 'cardapio': cardapio})


@admin_required
def cardapio_delete_view(request, pk):
    cardapio = get_object_or_404(Cardapio, pk=pk)
    if request.method == 'POST':
        cardapio.delete()
        messages.success(request, 'Cardápio excluído com sucesso!')
        return redirect('cardapio_list')
    return render(request, 'confirmar_exclusao.html', {
        'objeto': cardapio,
        'voltar_url': reverse('cardapio_list'),
    })
