const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

//  PostgreSQL connection 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fastapi',
  password: 'teranaam',
  port: 5432, // PostgreSQL default port
});


// Handle database connection errors
pool.on('error', (err) => {
  console.error('PostgreSQL pool error: ' + err);
});

// Check if the gaugesentiment column exists, and create it if not 
const checkColumnQuery = `
  DO $$ 
  BEGIN
    BEGIN
      ALTER TABLE scraped_data ADD COLUMN gaugesentiment INTEGER;
    EXCEPTION
      WHEN duplicate_column THEN RAISE NOTICE 'Column already exists';
    END;
  END $$;
`;

pool.query(checkColumnQuery, (error) => {
  if (error) {
    throw error;
  }

  console.log('Checked and potentially added gaugesentiment column to scraped_data table');

  //Update gaugesentiment values 
  const updateGaugeSentimentQuery = `
    UPDATE scraped_data
    SET gaugesentiment = 
      CASE
        WHEN sentiment = 0 THEN 0
        WHEN sentiment = 1 THEN 50
        WHEN sentiment = 2 THEN 100
        ELSE NULL
      END;
  `;

  pool.query(updateGaugeSentimentQuery, (updateError) => {
    if (updateError) {
      throw updateError;
    }

    console.log('Updated gaugesentiment values in scraped_data table');

    //avg
    const averageQuery = `
      SELECT AVG(gaugesentiment) AS averageSentiment
      FROM scraped_data
      WHERE news_type = 'social Media';
    `;

    pool.query(averageQuery, (averageError, averageResults) => {  
      if (averageError) {
        throw averageError;
      }

      const averageSentiment = averageResults.rows[0].averagesentiment || 0;

      console.log('Average Sentiment:', averageSentiment); 



       // avg for bitcoin-news
       const averageBitcoinQuery = `
       SELECT AVG(gaugesentiment) AS averageSentiment
       FROM scraped_data
       WHERE news_type = 'bitcoin-news';
     `;

     pool.query(averageBitcoinQuery, (bitcoinError, bitcoinResults) => {
       if (bitcoinError) {
         throw bitcoinError;
       }

       const averageBitcoinSentiment = bitcoinResults.rows[0].averagesentiment || 0;

       console.log('Average Bitcoin Sentiment:', averageBitcoinSentiment);
// avg for altcoin-news
const averageAltcoinQuery = `
  SELECT AVG(gaugesentiment) AS averageSentiment
  FROM scraped_data
  WHERE news_type = 'altcoin-news';
`;

pool.query(averageAltcoinQuery, (altcoinError, altcoinResults) => {
  if (altcoinError) {
    throw altcoinError;
  }

  const averageAltcoinSentiment = altcoinResults.rows[0].averagesentiment || 0;

  console.log('Average Altcoin Sentiment:', averageAltcoinSentiment);

  // avg for ethereum-news
  const averageEthereumQuery = `
    SELECT AVG(gaugesentiment) AS averageSentiment
    FROM scraped_data
    WHERE news_type = 'ethereum-news';
  `;

  pool.query(averageEthereumQuery, (ethereumError, ethereumResults) => {
    if (ethereumError) {
      throw ethereumError;
    }

    const averageEthereumSentiment = ethereumResults.rows[0].averagesentiment || 0;

    console.log('Average Ethereum Sentiment:', averageEthereumSentiment);

// avg for all news types
const averageAllNewsQuery = `
  SELECT AVG(gaugesentiment) AS averageSentiment
  FROM scraped_data
  WHERE news_type IN ('bitcoin-news', 'ethereum-news', 'altcoin-news', 'nft-news', 'defi-news', 'cryptonews-deals');
`;

pool.query(averageAllNewsQuery, (allNewsError, allNewsResults) => {
  if (allNewsError) {
    throw allNewsError;
  }

  const averageAllNewsSentiment = allNewsResults.rows[0].averagesentiment || 0;

  console.log('Average Sentiment (All News Types):', averageAllNewsSentiment);


      router.get('/', function (req, res, next) {
        const sql = `
          SELECT
            sentiment,
            COUNT(*) AS count
          FROM scraped_data
          GROUP BY sentiment;
        `;

        pool.query(sql, (error, results) => {
          if (error) {
            throw error;
          }

          console.log('Sentiment Distribution:', results.rows);

          const data = {
            labels: results.rows.map((row) => {

              switch (row.sentiment) {
                case 0:
                  return 'Bearish';
                case 1:
                  return 'Neutral';
                case 2:
                  return 'Bullish';
                default:
                  return 'Unknown';
              }
            }),
            datasets: [
              {
                data: results.rows.map((row) => row.count),
                backgroundColor: ['#FF5733', '#33FF55', '#3399FF'],
              },
            ],
          };

          res.render('overview', {
            title: 'overview',
            chartData: JSON.stringify(data),
            averageSentiment: averageSentiment,
            averageBitcoinSentiment: averageBitcoinSentiment,
            averageAllNewsSentiment: averageAllNewsSentiment,
          averageAltcoinSentiment: averageAltcoinSentiment,
          averageEthereumSentiment: averageEthereumSentiment,
          });
        });
      });
          });
          });
        });
      });
    });
  });
});



router.get('/news', function(req, res) {
  const overviewData = {
    title: 'overview',
    chartData: JSON.stringify(data),
    averageSentiment: averageSentiment,
    averageBitcoinSentiment: averageBitcoinSentiment,
    averageAllNewsSentiment: averageAllNewsSentiment,
    averageAltcoinSentiment: averageAltcoinSentiment,
    averageEthereumSentiment: averageEthereumSentiment,
  };

  // Render the news page with the overview data
  res.render('news', overviewData);
});

module.exports = router;

