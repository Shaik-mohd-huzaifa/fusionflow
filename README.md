# Project Setup

This document provides instructions to set up and run the server for the project.

## Prerequisites

- Python 3.x
- Node.js and npm
- Virtualenv (optional but recommended)

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/Shaik-mohd-huzaifa/fusionflow.git
cd fusionflow
```

### 2. Set Up Python Virtual Environment

It's recommended to use a virtual environment to manage dependencies. You can create and activate a virtual environment as follows:

```bash
# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On macOS and Linux
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

### 3. Install Python Dependencies

Install the required Python packages using `pip`:

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Copy the `.env.example` to `.env` and update the environment variables as needed:

```bash
cp .env.example .env
```

### 5. Run Database Migrations

Apply the database migrations to set up the database schema:

```bash
python manage.py migrate
```

### 6. Run the Development Server

Start the Django development server:

```bash
python manage.py runserver
```

### 7. Access the Application

Open your web browser and go to `http://127.0.0.1:8000` to access the application.

## Frontend Setup

### 1. Navigate to the Frontend Directory

Navigate to the `ai-flow-blox` directory:

```bash
cd ai-flow-blox
```

### 2. Install Node.js Dependencies

Install the required Node.js packages using npm:

```bash
npm install
```

### 3. Run the Frontend Development Server

Start the frontend development server:

```bash
npm run dev
```

### 4. Access the Frontend Application

Open your web browser and go to the URL provided by the Vite development server to access the frontend application.

## Additional Information

- Ensure that all environment variables are correctly set in the `.env` file.
- For more details on the API, refer to the `API_DOCUMENTATION.md` file.

## Troubleshooting

- If you encounter any issues, ensure that all dependencies are installed and that the environment variables are correctly configured.
- Check the console output for any error messages and follow the instructions provided.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.