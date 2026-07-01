from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

def index_view(request):
    return render(request, 'index.html')

def login_view(request):
    if request.method == 'POST':
        matricula = request.POST.get('matricula')
        senha = request.POST.get('senha')
        
        usuario = authenticate(request, username=matricula, password=senha)
        
        if usuario is not None:
            login(request, usuario)
            return redirect('index')
            
    return render(request, 'login.html')

def cadastro_view(request):
    return render(request, 'cadastro.html')

@login_required
def aluno_view(request):
    return render(request, 'privado/aluno.html')

@login_required
def avaliar_view(request):
    return render(request, 'privado/avaliar.html')

@login_required
def feedbacks_view(request):
    return render(request, 'privado/feedbacks.html')

@login_required
def relatorios_view(request):
    return render(request, 'privado/relatorios.html')