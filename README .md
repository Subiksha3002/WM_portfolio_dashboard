
                                FeedBack Management System


---I preserved the code in Docker if it use the following steps ---
first install the docker desktop in your system
then check these files are available in this repo dockerfile, .dockerignore 
then give the commands to build the backend "docker build -t django-dpdzero ."
then to run the backend port "docker run -p 8000:8000 django-dpdzero"


-- For Backend setup using Django Python--
step 1: open vscode terminal create virtual environment python -m venv venv
step 2: Then activate the environment using venv\Scripts\activate
step 3: To run the packages use the command "pip install -r requirements.txt"
step 4: Create a django project with project name(Expenses) using the command - "django-admin startproject DPDZero"
step 5: Once the project is created change the directy to the project folder here -  "cd DPDZero"
step 6: To check the server is running, give the command - : "python manage.py runserver"
step 7: Then create django app to create RESTAPIs - "python manage.py startapp Feedbacksystem"
step 8: Once the code is done then give the command to load the models and migrate it to the output port - "python manage.py makemigrations", "python manage.py migrate"
step 9: Finally run the server to view the backend output using the command - "python manage.py runserver.

backend endpoints:(tested via postman)
http://127.0.0.1:8000/api/token/
http://127.0.0.1:8000/api/portfolio/create/
http://127.0.0.1:8000/api/list/
http://127.0.0.1:8000/api/allocation/
http://127.0.0.1:8000/api/performance/
http://127.0.0.1:8000/api/summary/


----Front-end using React----
navigate to the path cd react app name
so to create react app install the requirements.txt as I given 
then give the command npm start to the run the react app

fronend APi endpoints:
http://localhost:3000/portfolio-overview
http://localhost:3000/asset-allocation
http://localhost:3000/performance-comparison
http://localhost:3000/holdings-table

Documentation:
1. Which AI tools did I use and how?
For this project, I primarily leveraged GitHub Copilot and ChatGPT-5.

GitHub Copilot assisted me by providing intelligent code suggestions and boilerplate code, which helped speed up development, especially in repetitive or standard coding patterns.

ChatGPT-5 was invaluable for clarifying complex concepts, particularly financial terms and calculation logic, and generating example code snippets. It also helped me troubleshoot and improve my React components, where I am still building my expertise.


2. What code was AI-generated vs. hand-written?
Hand-written code: The core backend logic, including the calculation algorithms, API responses, and status code handling, was entirely written by me. This involved defining how financial data should be processed and how responses are structured, ensuring a robust and well-tested foundation.

AI-generated code: I used AI mainly for frontend React components, as I am a beginner in React. The React UI code snippets, including some state handling and rendering logic, were generated or refined with the help of ChatGPT. This collaboration helped me quickly produce a working user interface while learning React principles.

3. How AI helped solve specific challenges?
As I am new to some financial terms and related calculations, AI played a key role in:

Explaining core financial concepts clearly so I could accurately apply formulas for gain/loss, returns, and other metrics.

Guiding me on how to translate these formulas into code and integrate them into API responses with proper status codes.

Helping debug and improve React components, offering suggestions to fix common pitfalls and improve code readability.

In summary, AI tools acted as both a coding assistant and a learning mentor, helping me overcome knowledge gaps and efficiently implement features.

And also in future I will put the authentication credentials in .env for the secure data 