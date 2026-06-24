from django.shortcuts import render

def index_view(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

def cadastro_view(request):
    return render(request, 'cadastro.html')

def aluno_view(request):
    return render(request, 'aluno.html')

def avaliar_view(request):
    return render(request, 'avaliar.html')

def feedbacks_view(request):
    return render(request, 'feedbacks.html')

def relatorios_view(request):
    return render(request, 'relatorios.html')