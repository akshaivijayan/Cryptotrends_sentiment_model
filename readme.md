# Project Name

A brief description of your project.

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

Explain what your project does and its main components involving both Python and Node.js.

## Prerequisites

- Python 3.11 or less
- Node.js
- npm
- postgreSQL with pgadmin

## Getting Started

Clone the repository to your local machine:

git clone https://github.com/akshaivijayan/Cryptotrends_sentiment_model
cd Cryptotrends_sentiment_model/cryptotrends

## Installation

1) Create a Python virtual environment: 
python -m venv venv

2)Activate the virtual environment:
.\venv\Scripts\activate.bat

3)Install Python dependencies:
pip install -r requirements.txt

4)Install Node.js dependencies:
npm install

## Usage

1) Create a database in postgresql(pgadmin) with following credentials
DATABASE_URL = "postgresql://postgres:teranaam@localhost/fastapi"

2) Run the backend:
npm run start-backend
go to : http://localhost:8000 #to scrape the data to table

3) Run the frontend:
npm run start-frontend
go to : http://localhost:3000 #to view the dashboard
