# Crypto Sentimental Analysis

A project to provide insights into market sentiment trends and help users stay informed about the mood surrounding specific cryptocurrencies


## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

The Cryptotrends Sentiment Model is an innovative project that merges Python and Node.js technologies to provide a comprehensive solution for analyzing and visualizing cryptocurrency trends. This tool empowers users with real-time sentiment analysis, enabling them to gain valuable insights into the volatile world of cryptocurrencies. Leveraging a PostgreSQL database and intuitive dashboards, it seamlessly scrapes and displays data, enhancing the user's ability to make informed decisions. The project's robust architecture, combined with a user-friendly interface, makes it a valuable resource for cryptocurrency enthusiasts, traders, and researchers seeking to navigate and understand the dynamic landscape of digital assets.


## Prerequisites

- Python 3.11 
- Node.js
- npm
- postgreSQL with pgadmin
- git

## Getting Started

Clone the repository to your local machine:

git clone https://github.com/akshaivijayan/Cryptotrends_sentiment_model

cd Cryptotrends_sentiment_model

## Installation

1) Create a Python virtual environment: 
python -m venv venv

2) Activate the virtual environment:
.\venv\Scripts\activate.bat

3) Install Python dependencies:
pip install -r requirements.txt

4) Download Extra modules needed

- python -m nltk.downloader punkt stopwords wordnet
- python -m spacy download en_core_web_lg==3.1.0

4) Install Node.js dependencies:
npm install

## Usage

1) Create a database in postgresql(pgadmin) with following credentials
DATABASE_URL = "postgresql://postgres:teranaam@localhost/fastapi"

2) Move to the specific directory
cd cryptotrends

3) Run the backend:
npm run start-backend
go to : http://localhost:8000 #to scrape the data to table

4) Run the frontend:
npm run start-frontend
go to : http://localhost:3000 #to view the dashboard
