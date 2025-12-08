// Get user status and update header buttons
function updateHeaderButtons() {
    fetch('/user/status/')
        .then(response => response.json())
        .then(data => {
            const userSection = document.getElementById('user-section');
            userSection.innerHTML = '';
            if (data.success && data.data.is_authenticated) {
                // Logged-in: show logout and chicken create
                const logoutBtn = document.createElement('button');
                logoutBtn.textContent = '로그아웃';
                logoutBtn.type = 'button';
                logoutBtn.className = 'btn';
                logoutBtn.onclick = logoutUser;
                userSection.appendChild(logoutBtn);

                const createBtn = document.createElement('button');
                createBtn.textContent = '치킨 등록';
                createBtn.type = 'button';
                createBtn.className = 'btn';
                createBtn.onclick = () => { window.location.href = '/upload.html'; };
                userSection.appendChild(createBtn);
            } else {
                // Not logged-in: show login and signup
                const loginBtn = document.createElement('button');
                loginBtn.textContent = '로그인';
                loginBtn.type = 'button';
                loginBtn.className = 'btn';
                loginBtn.onclick = () => { window.location.href = '/login.html'; };
                userSection.appendChild(loginBtn);

                const signupBtn = document.createElement('button');
                signupBtn.textContent = '회원가입';
                signupBtn.type = 'button';
                signupBtn.className = 'btn';
                signupBtn.onclick = () => { window.location.href = '/sign_up.html'; };
                userSection.appendChild(signupBtn);
            }
        });
}

// Login user
function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.data.message);
            window.location.href = '/';
        } else {
            alert(data.error);
        }
    });
}

// Sign up user
function signUpUser() {
    const username = document.getElementById('username').value;
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;

    fetch('/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password1=${encodeURIComponent(password1)}&password2=${encodeURIComponent(password2)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.data.message);
            window.location.href = '/login.html';
        } else {
            alert(data.error);
        }
    });
}

// Logout user
function logoutUser() {
    fetch('/logout/', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.data.message);
            updateHeaderButtons();
        } else {
            alert(data.error);
        }
    });
}

// Render chicken list as cards
function renderChickenList(chickens) {
    const listDiv = document.getElementById('chicken-list');
    listDiv.innerHTML = '';
    chickens.forEach(c => {
        const card = document.createElement('div');
        card.className = 'chicken-item';
        card.innerHTML = `
            <img src="${c.image_url}" alt="${c.name}" />
            <h3>${c.name}</h3>
            <p>${c.brand} - ${c.style}</p>
            <div class="meta">
                <span class="badge badge-style">Spice: ${c.spiciness}</span>
                <span class="badge badge-style">Sweet: ${c.sweetness}</span>
                <span class="badge badge-style">Crisp: ${c.crispiness}</span>
            </div>
            <p>${c.description}</p>
        `;
        listDiv.appendChild(card);
    });
}

// Fetch all chicken and display
function fetchChickenList() {
    fetch('/chicken/list/')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderChickenList(data.data);
            }
        });
}

// Search chicken by name
function searchChicken() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    fetch('/chicken/list/')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const filtered = data.data.filter(c => c.name.toLowerCase().includes(query));
                renderChickenList(filtered);
            }
        });
}

// Create chicken
function createChicken() {
    const image_url = document.getElementById('image_url').value;
    const brand = document.getElementById('brand').value;
    const style = document.getElementById('style').value;
    const name = document.getElementById('name').value;
    const spiciness = document.getElementById('spiciness').value;
    const sweetness = document.getElementById('sweetness').value;
    const crispiness = document.getElementById('crispiness').value;
    const description = document.getElementById('description').value;

    const params = `image_url=${encodeURIComponent(image_url)}&brand=${encodeURIComponent(brand)}&style=${encodeURIComponent(style)}&name=${encodeURIComponent(name)}&spiciness=${encodeURIComponent(spiciness)}&sweetness=${encodeURIComponent(sweetness)}&crispiness=${encodeURIComponent(crispiness)}&description=${encodeURIComponent(description)}`;

    fetch('/chicken/create/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.data.message);
            window.location.href = '/';
        } else {
            alert(data.error);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderButtons();
    fetchChickenList();
});
