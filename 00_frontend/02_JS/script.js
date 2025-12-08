// script.js

// Default API URL
const API_BASE = 'http://localhost:8000';

// JSON POST request function
async function postData(url, formData) {
    const response = await fetch(url, { method: 'POST', body: formData, credentials: 'include' });
    return response.json();
}

// Sign up
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const res = await postData(`${API_BASE}/signup/`, formData);
        document.getElementById('result').innerText = res.success ? '회원 가입에 성공했어요' : res.error;
    });
}

// Log in
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const res = await postData(`${API_BASE}/login/`, formData);
        document.getElementById("result").innerText = res.success ? '로그인에 성공했어요' : res.error;
        if (res.success) {
            setTimeout(() => {
                location.href = 'index.html';
            }, 800);
        }
    });
}

// Log out
async function logout() {
    const formData = new FormData();
    const res = await postData(`${API_BASE}/logout/`, formData);
    alert(res.success ? '로그아웃에 성공했어요' : res.error);
    location.reload();
}

// Create chicken
const createChickenForm = document.getElementById('createChickenForm');
if (createChickenForm) {
    createChickenForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createChickenForm);
        const res = await postData(`${API_BASE}/chicken/create/`, formData);
        document.getElementById('result').innerText = res.success ? '치킨 등록에 성공했어요' : res.error;
    });
}

// Load chicken for update and delete
async function loadChickenInfo() {
    const id = document.getElementById('editChickenId').value;
    if (!id) {
        alert('치킨 ID를 입력해주세요');
        return;
    }
    const res = await fetch(`${API_BASE}/chicken/list/`, { credentials: 'include' });
    const data = await res.json();
    if (!data.success) {
        alert(data.error);
        return;
    }
    const chicken = data.data.find(c => c.id == id);
    if (!chicken) {
        alert('치킨이 존재하지 않아요');
        return;
    }

    // Update form
    const form = document.getElementById('updateChickenForm');
    form.innerHTML = `
        <label>이미지 URL: 
            <input type = 'text' id = 'edit_image_url' value = '${chicken.image_url}'>
        </label><br>

        <label>브랜드: 
            <input type = 'text' id = 'edit_brand' value = '${chicken.brand}'>
        </label><br>

        <label>스타일: 
            <input type = 'text' id = 'edit_style' value = '${chicken.style}'>
        </label><br>

        <label>이름: 
            <input type = 'text' id = 'edit_name' value = '${chicken.name}'>
        </label><br>

        <label>매운맛(1~5): 
            <input type = 'number' id = 'edit_spiciness' min = '1' max = '5' value = '${chicken.spiciness}'>
        </label><br>

        <label>단맛(1~5): 
            <input type = 'number' id = 'edit_sweetness' min = '1' max = '5' value = '${chicken.sweetness}'>
        </label><br>

        <label>바삭함(1~5): 
            <input type = 'number' id = 'edit_crispiness' min = '1' max = '5' value = '${chicken.crispiness}'>
        </label><br>

        <label>설명: 
            <textarea id = 'edit_description'>${chicken.description}</textarea>
        </label><br>
    `;
    document.getElementById('editSection').style.display = 'block';
}

// Update chicken
async function updateChicken() {
    const id = document.getElementById('editChickenId').value;
    const formData = new FormData();
    formData.append('image_url', document.getElementById('edit_image_url').value);
    formData.append('brand', document.getElementById('edit_brand').value);
    formData.append('style', document.getElementById('edit_style').value);
    formData.append('name', document.getElementById('edit_name').value);
    formData.append('spiciness', document.getElementById('edit_spiciness').value);
    formData.append('sweetness', document.getElementById('edit_sweetness').value);
    formData.append('crispiness', document.getElementById('edit_crispiness').value);
    formData.append('description', document.getElementById('edit_description').value);
    const res = await postData(`${API_BASE}/chicken/update/${id}/`, formData);
    alert(res.success ? '치킨 수정에 성공했어요' : res.error);
}

// Delete chicken
async function deleteChicken() {
    const id = document.getElementById('editChickenId').value;
    if (!confirm('정말 치킨을 삭제할까요?')) return;
    const formData = new FormData();
    const res = await postData(`${API_BASE}/chicken/delete/${id}/`, formData);
    alert(res.success ? '치킨 삭제에 성공했어요' : res.error);
    if (res.success) location.reload();
}

// Search chicken
function searchChicken() {
    const keyword = document.getElementById('searchInput').value.trim();
    const items = document.querySelectorAll('.chicken-item');
    items.forEach((item) => {
        const name = item.querySelector('h3').innerText;
        item.style.display = name.includes(keyword) ? 'block' : 'none';
    });
}

// If index.html then load chicken list automaticly
if (document.getElementById('chicken-list')) {
    loadChickenList();
}

// Load chicken list
async function loadChickenList() {
    const res = await fetch(`${API_BASE}/chicken/list/`, { credentials: 'include' });
    const data = await res.json();
    if (!data.success) {
        alert(data.error);
        return;
    }
    const list = document.getElementById('chicken-list');
    if (!list) return;
    list.innerHTML = '';
    data.data.forEach((c) => {
        const div = document.createElement('div');
        div.className = 'chicken-item';
        div.innerHTML = `
            <h3>${c.name}</h3>
            <p><img src = '${c.image_url}' width = '150'></p>
            <p><strong>브랜드:</strong> ${c.brand}</p>
            <p><strong>스타일:</strong> ${c.style}</p>
            <p><strong>매운맛:</strong> ${c.spiciness}</p>
            <p><strong>단맛:</strong> ${c.sweetness}</p>
            <p><strong>바삭함:</strong> ${c.crispiness}</p>
            <p>${c.description}</p>
            <hr>
        `;
        list.appendChild(div);
    });
}