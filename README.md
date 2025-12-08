# Chicken Site
This project is project that building chicken web server. This project utilizes HTML, CSS, JavaScript, Amazon Web Services(AWS), and Python Django.

## Feature
- Provides user registration, login, and logout functionality.
- Logged-in users can register, edit, and delete chicken item, including: image URL, brand, style(fried, spicy, soy sauce, mala, cheese), name, spiciness level, sweetness level, crispiness level, and a short description.
- Both logged-in and non-logged-in users can search and view all registered chicken items.

## Project Structure
```
Chicken Site/
├── 00_frontend/                    # This directory is source code directory for frontend
│ ├── 00_HTML/                      # This directory is HTML source code directory
│ │ ├── index.html                  # This file is HTML source code file for chicken search and viewing
│ │ ├── sign_up.html                # This file is HTML source code file for user registration
│ │ ├── login.html                  # This file is HTML source code file for user login
│ │ └── upload.html                 # This file is HTML source code file for registering, editing and deleting chicken items
│ ├── 01_CSS/                       # This directory is CSS source code directory
│ │ └── style.css
│ └── 02_JS/                        # This directory is JavaScript source code directory
│   └── script.js
├── 01_backend/chicken_site_project # This directory is backend source code directory
│ ├── chicken_site_app/
│ │ ├── admin.py
│ │ ├── apps.py
│ │ ├── models.py
│ │ ├── views.py
│ │ └── tests.py
│ ├── chicken_site_project/
│ │ ├── asgi.py
│ │ ├── settings.py
│ │ ├── urls.py
│ │ └── wsgi.py
│ └── manage.py
├── Chicken Site Document
├── LICENSE
└── README.md
```

## Installation
1. Install dependencies
	```
	sudo dnf update -y
	sudo dnf install git -y
	sudo dnf install -y python3 python3-pip
	pip install --upgrade pip
	pip install django
	```

2. Clone the repository
	```
	gh repo clone YooJunHyuk123/Chicken-site
	```

3. Navigate to the project directory
	```
	cd Chicken-site/01_backend/chicken_site_project
	```
4. Make migrations, migrate, and run server
	```
	python3 manage.py makemigrations
	python3 manage.py migrate
	python3 manage.py runserver [option]
	```

## Usage
1. Search for or view chicken items
2. Sign up or log in
3. Register, edit, or delete chicken items

## Test
We tested the non-functional requirements described in the document
- Tested whether the UI and UX functions correctly
- Tested the server's response speed and scalability
- Tested data protection and access control

## Contributing
1. Create a new branch.
	```
	git checkout -b your_branch
	```

2. Commit your changes.
	```
	git add .
	git commit -m "Commit message"
	```

3. Push to the branch.
	```
	git push origin your_branch
	```

4. Open a pull request.

## License
This project is licensed under the MIT License.

## Authors
- Yoo, J. H. ([Yoo, J. H.](https://github.com/YooJunHyuk123))
Email: a01091040305@gmail.com

- Kim, K. Y. ([Kim, K. Y.](https://githube.com/euden112))
Email: kky031120@gmail.com
