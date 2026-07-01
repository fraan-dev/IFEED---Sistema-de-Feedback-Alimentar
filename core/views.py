from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import get_user_model
from .models import Usuario, Avaliacao
import json

User = get_user_model()


def index_view(request):
    return render(request, 'index.html')


def login_view(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'tipo_usuario'):
            if request.user.tipo_usuario == 'ALUNO':
                return redirect('aluno')
            elif request.user.tipo_usuario == 'ADMIN':
                return redirect('relatorios')
        return redirect('index')
    
    if request.method == 'POST':
        login_input = request.POST.get('login')
        senha = request.POST.get('senha')
        tipo = request.POST.get('tipo')
        
        tipo_map = {
            'aluno': 'ALUNO',
            'administrador': 'ADMIN'
        }
        tipo_modelo = tipo_map.get(tipo, 'ALUNO')
        
        user = None
        try:
            if '@' in login_input:
                user = User.objects.get(email=login_input)
            else:
                user = User.objects.get(username=login_input)
        except User.DoesNotExist:
            messages.error(request, 'Usuário não encontrado. Verifique sua matrícula ou e-mail.')
            return render(request, 'login.html')
        
        usuario = authenticate(request, username=user.username, password=senha)
        
        if usuario is not None:
            if usuario.tipo_usuario != tipo_modelo:
                messages.error(request, f'Tipo de usuário incorreto. Você é {usuario.get_tipo_usuario_display()}.')
                return render(request, 'login.html')
            
            login(request, usuario)
            
            if usuario.tipo_usuario == 'ADMIN':
                return redirect('relatorios')
            else:
                return redirect('aluno')
        else:
            messages.error(request, 'Senha incorreta. Tente novamente.')
    
    return render(request, 'login.html')


def cadastro_view(request):
    if request.method == 'POST':
        nome_completo = request.POST.get('nome')
        matricula = request.POST.get('matricula')
        curso = request.POST.get('curso')
        turma = request.POST.get('turma')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmarSenha')
        tipo = request.POST.get('tipoUsuario')
        
        tipo_map = {
            'aluno': 'ALUNO',
            'administrador': 'ADMIN'
        }
        tipo_modelo = tipo_map.get(tipo, 'ALUNO')
        
        if senha != confirmar_senha:
            messages.error(request, 'As senhas não coincidem.')
            return render(request, 'cadastro.html')
        
        if len(senha) < 6:
            messages.error(request, 'A senha deve ter pelo menos 6 caracteres.')
            return render(request, 'cadastro.html')
        
        if User.objects.filter(username=matricula).exists():
            messages.error(request, 'Matrícula já cadastrada. Use outra matrícula.')
            return render(request, 'cadastro.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'E-mail já cadastrado. Use outro e-mail.')
            return render(request, 'cadastro.html')
        
        try:
            user = User.objects.create_user(
                username=matricula,
                password=senha,
                email=email
            )
            
            user.nome_completo = nome_completo
            user.matricula = matricula
            user.curso = curso
            user.turma = turma
            user.tipo_usuario = tipo_modelo
            user.save()
            
            messages.success(request, 'Cadastro realizado com sucesso! Faça login.')
            return redirect('login')
            
        except Exception as e:
            messages.error(request, f'Erro ao cadastrar: {str(e)}')
            return render(request, 'cadastro.html')
    
    return render(request, 'cadastro.html')


def logout_view(request):
    logout(request)
    messages.success(request, 'Você saiu do sistema.')
    return redirect('login')


@login_required
def aluno_view(request):
    if request.user.tipo_usuario != 'ALUNO':
        messages.error(request, 'Acesso restrito a alunos.')
        return redirect('index')
    
    avaliacoes = Avaliacao.objects.filter(
        aluno=request.user
    ).order_by('-data')[:5]
    
    context = {
        'avaliacoes': avaliacoes,
        'usuario': request.user,
    }
    return render(request, 'aluno.html', context)


@login_required
def avaliar_view(request):
    if request.user.tipo_usuario != 'ALUNO':
        messages.error(request, 'Apenas alunos podem avaliar refeições.')
        return redirect('index')
    
    if request.method == 'POST':
        try:
            meal_name = request.POST.get('meal_name', '')
            meal_type = request.POST.get('meal_type', '')
            
            avaliacao_geral = int(request.POST.get('avaliacaoGeral', 0))
            sabor = int(request.POST.get('sabor', 0))
            apresentacao = int(request.POST.get('apresentacao', 0))
            temperatura = int(request.POST.get('temperatura', 0))
            quantidade = int(request.POST.get('quantidade', 0))
            comentario = request.POST.get('comentario', '')
            
            avaliacao = Avaliacao.objects.create(
                aluno=request.user,
                refeicao=f"{meal_type} - {meal_name}",
                avaliacao_geral=avaliacao_geral,
                sabor=sabor,
                apresentacao=apresentacao,
                temperatura=temperatura,
                quantidade=quantidade,
                comentario=comentario
            )
            
            messages.success(request, 'Avaliação enviada com sucesso! Obrigado pelo feedback!')
            return redirect('aluno')
            
        except Exception as e:
            messages.error(request, f'Erro ao enviar avaliação: {str(e)}')
            return render(request, 'avaliacao.html')
    
    return render(request, 'avaliacao.html')


@login_required
def feedbacks_view(request):
    if request.user.tipo_usuario != 'ADMIN':
        messages.error(request, 'Acesso restrito a administradores.')
        return redirect('index')
    
    avaliacoes = Avaliacao.objects.all().order_by('-data')
    
    feedbacks_data = []
    for av in avaliacoes:
        feedbacks_data.append({
            'aluno': av.aluno.nome_completo,
            'matricula': av.aluno.matricula,
            'refeicao': av.refeicao,
            'avaliacaoGeral': av.avaliacao_geral,
            'sabor': av.sabor,
            'apresentacao': av.apresentacao,
            'temperatura': av.temperatura,
            'quantidade': av.quantidade,
            'comentario': av.comentario,
            'data': av.data.strftime('%Y-%m-%d'),
        })
    
    context = {
        'feedbacks_json': json.dumps(feedbacks_data),
        'total_feedbacks': len(feedbacks_data),
    }
    return render(request, 'feedbacks.html', context)


@login_required
def relatorios_view(request):
    if request.user.tipo_usuario != 'ADMIN':
        messages.error(request, 'Acesso restrito a administradores.')
        return redirect('index')
    
    avaliacoes = Avaliacao.objects.all()
    chart_data = {}
    
    if avaliacoes.count() > 0:
        media_sabor = sum([a.sabor for a in avaliacoes]) / avaliacoes.count()
        media_apresentacao = sum([a.apresentacao for a in avaliacoes]) / avaliacoes.count()
        media_temperatura = sum([a.temperatura for a in avaliacoes]) / avaliacoes.count()
        media_quantidade = sum([a.quantidade for a in avaliacoes]) / avaliacoes.count()
        
        distribuicao = {}
        for i in range(1, 6):
            distribuicao[i] = avaliacoes.filter(avaliacao_geral=i).count()
        
        por_refeicao = {}
        for av in avaliacoes:
            tipo = av.refeicao.split(' - ')[0]
            por_refeicao[tipo] = por_refeicao.get(tipo, 0) + 1
        
        chart_data = {
            'distribuicao': [distribuicao[1], distribuicao[2], distribuicao[3], distribuicao[4], distribuicao[5]],
            'categorias': {
                'sabor': round(media_sabor, 1),
                'apresentacao': round(media_apresentacao, 1),
                'temperatura': round(media_temperatura, 1),
                'quantidade': round(media_quantidade, 1),
            },
            'por_refeicao': por_refeicao,
            'total': avaliacoes.count(),
        }
    else:
        chart_data = {
            'distribuicao': [0, 0, 0, 0, 0],
            'categorias': {
                'sabor': 0,
                'apresentacao': 0,
                'temperatura': 0,
                'quantidade': 0
            },
            'por_refeicao': {},
            'total': 0,
        }
    
    context = {
        'chart_data': json.dumps(chart_data),
        'total_feedbacks': avaliacoes.count(),
    }
    return render(request, 'relatorios.html', context)