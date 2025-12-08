from django.contrib.auth import authenticate, get_user_model, login as auth_login, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Chicken

User = get_user_model()

def _json(success, data=None, error=None, status=200):
    response = {'success': success}
    if success and data is not None:
        response['data'] = data
    if not success and error is not None:
        response['error'] = error
    return JsonResponse(response, status=status)

def _require_login(request):
    if not request.user.is_authenticated:
        return _json(False, error='로그인이 필요해요', status=401)
    return None

def chicken_list(request):
    chickens = Chicken.objects.all().order_by('-id')
    data = [
        {'id': c.id, 'user': c.user.username, 'image_url': c.image_url, 'brand': c.brand, 'style': c.style, 'name': c.name, 'spiciness': c.spiciness, 'sweetness': c.sweetness, 'crispiness': c.crispiness, 'description': c.description}
        for c in chickens
    ]
    return _json(True, data=data)

@csrf_exempt
def signup(request):
    if request.method != 'POST':
        return _json(False, error='POST 요청만 가능해요', status=405)

    username = request.POST.get('username')
    password1 = request.POST.get('password1')
    password2 = request.POST.get('password2')

    if not username or not password1 or not password2:
        return _json(False, error='아이디와 비밀번호를 모두 입력해주세요', status=400)
    elif User.objects.filter(username=username).exists():
        return _json(False, error='아이디가 이미 존재해요', status=400)
    elif password1 != password2:
        return _json(False, error='비밀번호가 일치하지 않아요', status=400)

    user = User.objects.create_user(username=username, password=password1)
    return _json(True, data={'message': '회원 가입에 성공했어요'})

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return _json(False, error='POST 요청만 가능해요', status=405)

    username = request.POST.get('username')
    password = request.POST.get('password')

    if not username or not password:
        return _json(False, error='아이디와 비밀번호를 모두 입력해주세요', status=400)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return _json(False, error='아이디 또는 비밀번호가 일치하지 않아요', status=400)

    auth_login(request, user)
    return _json(True, data={'message': '로그인에 성공했어요'})

@csrf_exempt
def logout(request):
    if request.method != 'POST':
        return _json(False, error='POST 요청만 가능해요', status=405)

    auth_logout(request)
    return _json(True, data={'message': '로그아웃에 성공했어요'})

def user_status(request):
    return _json(True, data={'is_authenticated': request.user.is_authenticated})

@csrf_exempt
def chicken_create(request):
    if request.method != 'POST':
        return _json(False, error='POST 요청만 가능해요', status=405)

    need_login = _require_login(request)
    if need_login:
        return need_login

    image_url = request.POST.get('image_url')
    brand = request.POST.get('brand')
    style = request.POST.get('style')
    name = request.POST.get('name')
    spiciness = request.POST.get('spiciness')
    sweetness = request.POST.get('sweetness')
    crispiness = request.POST.get('crispiness')
    description = request.POST.get('description')

    if not all([image_url, brand, style, name, spiciness, sweetness, crispiness, description]):
        return _json(False, error='모든 내용을 입력해주세요', status=400)

    chicken = Chicken.objects.create(user=request.user, image_url=image_url, brand=brand, style=style, name=name, spiciness=spiciness, sweetness=sweetness, crispiness=crispiness, description=description)
    return _json(True, data={'message': '치킨 등록에 성공했어요', 'id': chicken.id})

@csrf_exempt
def chicken_update(request, chicken_id):
    if request.method != 'POST':
        return _json(False, error='POST 요청만 가능해요', status=405)

    need_login = _require_login(request)
    if need_login:
        return need_login

    try:
        chicken = Chicken.objects.get(id=chicken_id, user=request.user)
    except Chicken.DoesNotExist:
        return _json(False, error='치킨이 존재하지 않거나 수정 권한이 없어요', status=404)

    for field in ['image_url', 'brand', 'style', 'name', 'spiciness', 'sweetness', 'crispiness', 'description']:
        value = request.POST.get(field)
        if value is not None:
            setattr(chicken, field, value)
    chicken.save()
    return _json(True, data={'message': '치킨 수정에 성공했어요'})

@csrf_exempt
def chicken_delete(request, chicken_id):
    if request.method != 'POST':
        return _json(False, error='POST 요청만 가능해요', status=405)

    need_login = _require_login(request)
    if need_login:
        return need_login

    try:
        chicken = Chicken.objects.get(id=chicken_id, user=request.user)
    except Chicken.DoesNotExist:
        return _json(False, error='치킨이 존재하지 않거나 삭제 권한이 없어요', status=404)

    chicken.delete()
    return _json(True, data={'message': '치킨 삭제에 성공했어요'})
