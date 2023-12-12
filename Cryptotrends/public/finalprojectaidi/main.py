from fastapi import FastAPI
from bs4 import BeautifulSoup
import requests
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import pickle
import spacy
import numpy as np
import praw
from .preprocess import preprocess_text

reddit = praw.Reddit(client_id='57sReOENpor__WmnpdQAFw', client_secret='4i6Xk64hQI7haFKA2JKBDfOjA2L1Vg', user_agent='WebScraping')

app = FastAPI()

DATABASE_URL = "postgresql://postgres:teranaam@localhost/fastapi"

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print(f"Database setup error: {e}")
    raise

Base = declarative_base()

class ScrapedData(Base):
    __tablename__ = "scraped_data"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    sentiment = Column(Integer)  
    news_type = Column(String)
    coins = Column(String)

Base.metadata.create_all(bind=engine)

with open("crypto_model_final.pkl", "rb") as model_file:
    model = pickle.load(model_file)
@app.get("/")
async def read_root():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
    }
    headline_lst = []
    sentiment_scores = []
    news_type_lst = []
    coin_lst = []
    
    crypto_names = [
    "bitcoin", "ethereum", "ripple", "xrp", "cardano", "ada", "litecoin", "ltc", "dogecoin", "doge",
    "polkadot", "dot", "chainlink", "link", "stellar", "xlm", "aave", "aave", "uniswap", "uni", "vechain", "vet"]
    
    nlp = spacy.load("en_core_web_lg")
    ml_subreddit = reddit.subreddit('crypto')

    posts = ml_subreddit.new(limit=10) 
    for post in posts:
        news_type_lst.append("social Media")
        headline_lst.append(preprocess_text(post.title))
        vector =  nlp(post.title).vector
        sent = model.predict([vector]) 
        #appending coins
        crypto_coin_names = [ent.text.lower() for ent in nlp(post.title) if ent.text in crypto_names]
        coin_string = ", ".join(list(set(crypto_coin_names)))
        coin_lst.append(coin_string)

        if sent[0] == 0 :
            sentiment_scores.append(0)
        elif sent[0] == 1 :
            sentiment_scores.append(1)
        else:
            sentiment_scores.append(2)


    for i in ["bitcoin-news","ethereum-news","altcoin-news","nft-news","defi-news","cryptonews-deals"]:
        url = f"https://cryptonews.com/news/{i}/"

        try:
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')

                articles = soup.select('a.article__title.article__title--lg.article__title--featured.mb-20')

                for article in articles:
                    article_url = article['href']
                    article_response = requests.get(article_url, headers=headers)

                    if article_response.status_code == 200:
                        article_soup = BeautifulSoup(article_response.content, 'html.parser')
                        article_content = article_soup.find('div', class_='article-single__content category_contents_details')
                        paragraphs = article_content.find_all('p')
                        merged_paragraphs = ""
                        for paragraph in paragraphs[:len(paragraphs) - 1]:
                            merged_paragraphs += paragraph.get_text() + " "   
                        
                        news_type_lst.append(i)
                        headline = preprocess_text(merged_paragraphs)
                        vector =  nlp(headline).vector

                        #appending coins
                        crypto_coin_names = [ent.text.lower() for ent in nlp(headline) if ent.text in crypto_names]
                        coin_string = ", ".join(list(set(crypto_coin_names)))
                        coin_lst.append(coin_string)
                        
                        headline_lst.append(headline)
                        sent = model.predict([vector])   

                        if sent[0] == 0 :
                            sentiment_scores.append(0)
                        elif sent[0] == 1 :
                            sentiment_scores.append(1)
                        else:
                            sentiment_scores.append(2)
                    else:
                        return {"error": "Failed to fetch the internalwebpage"}
                    
            else:
                return {"error": "Failed to fetch the webpage"}
        except Exception as e:
            return {"error": str(e)}
    db = SessionLocal()
    for headline, sentiment,newstype,coin in zip(headline_lst, sentiment_scores,news_type_lst,coin_lst):
        db_data = ScrapedData(title=headline, sentiment=sentiment,news_type=newstype,coins =coin)
        db.add(db_data)
    db.commit()
    db.close()
    return {"message": "Scraping and storing complete."}

    