// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const NewsSentiment = ({ userId }) => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [visibleNewsCount, setVisibleNewsCount] = useState(10); // Initial batch of news to show

//   // Function to load more news
//   const loadMoreNews = () => {
//     setVisibleNewsCount((prevCount) => prevCount + 10);
//   };

//   useEffect(() => {
//     const fetchPortfolioAndNews = async () => {
//       try {
//         setLoading(true);

//         // Step 1: Fetch portfolio to get tickers
//         const portfolioResponse = await axios.get(`/api/portfolio/${userId}`);
//         const portfolioStocks = portfolioResponse.data;

//         const tickers = portfolioStocks.map((stock) => stock.ticker);

//         if (tickers.length === 0) {
//           setError("No stocks found in the portfolio.");
//           setLoading(false);
//           return;
//         }

//         // Step 2: Fetch news sentiment for the tickers
//         const newsResponse = await axios.post("/api/news-sentiment", { tickers });
//         const fetchedNews = newsResponse.data;

//         // Remove duplicate news (based on URL)
//         const uniqueNews = [];
//         const seenUrls = new Set();

//         fetchedNews.forEach((article) => {
//           if (!seenUrls.has(article.url)) {
//             seenUrls.add(article.url);
//             uniqueNews.push(article);
//           }
//         });

//         // Sort by most recent published date
//         const sortedNews = uniqueNews.sort(
//           (a, b) =>
//             new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
//         );

//         setNews(sortedNews);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch news sentiment data.");
//         console.error("Error fetching news sentiment:", err);
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchPortfolioAndNews();
//     }
//   }, [userId]);

//   if (loading) return <p>Loading news sentiment...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (news.length === 0) return <p>No news available for the selected tickers.</p>;

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">News Sentiment</h2>
//       <ul>
//         {news.slice(0, visibleNewsCount).map((article, index) => (
//           <li
//             key={index}
//             className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0"
//           >
//             <h3 className="text-lg font-semibold text-blue-600">
//               <a href={article.url} target="_blank" rel="noopener noreferrer">
//                 {article.title}
//               </a>
//             </h3>
//             <p className="text-gray-600">{article.summary}</p>
//             <p className="text-sm text-gray-500">
//               Sentiment:{" "}
//               <span
//                 className={`font-bold ${
//                   article.sentiment_label === "Bullish"
//                     ? "text-green-600"
//                     : article.sentiment_label === "Bearish"
//                     ? "text-red-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 {article.sentiment_label}
//               </span>
//             </p>
//           </li>
//         ))}
//       </ul>
//       {visibleNewsCount < news.length && (
//         <div className="text-center mt-4">
//           <button
//             onClick={loadMoreNews}
//             className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
//           >
//             Show More
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewsSentiment;




import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsSentiment = ({ userId }) => {
  const [newsByTicker, setNewsByTicker] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioAndNews = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch portfolio to get tickers
        const portfolioResponse = await axios.get(`/api/portfolio/${userId}`);
        const portfolioStocks = portfolioResponse.data;

        const tickers = portfolioStocks.map((stock) => stock.ticker);

        if (tickers.length === 0) {
          setError("No stocks found in the portfolio.");
          setLoading(false);
          return;
        }

        // Step 2: Fetch news sentiment for each ticker
        const newsResponse = await axios.post("/api/news-sentiment", { tickers });
        const newsByTickerRaw = newsResponse.data;

        // Limit each ticker to 10 articles
        const limitedNewsByTicker = {};
        Object.keys(newsByTickerRaw).forEach((ticker) => {
          limitedNewsByTicker[ticker] = newsByTickerRaw[ticker].slice(0, 10);
        });

        setNewsByTicker(limitedNewsByTicker);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch news sentiment data.");
        console.error("Error fetching news sentiment:", err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchPortfolioAndNews();
    }
  }, [userId]);

  if (loading) return <p>Loading news sentiment...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (Object.keys(newsByTicker).length === 0)
    return <p>No news available for the selected tickers.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full">
      {Object.entries(newsByTicker).map(([ticker, articles]) => (
        <div key={ticker} className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">News for {ticker}</h3>
          <ul>
            {articles.map((article, index) => (
              <li
                key={index}
                className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0"
              >
                <h4 className="text-lg font-semibold text-blue-600">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h4>
                <p className="text-gray-600">{article.summary}</p>
                <p className="text-sm text-gray-500">
                  Sentiment:{" "}
                  <span
                    className={`font-bold ${
                      article.sentiment_label === "Bullish"
                        ? "text-green-600"
                        : article.sentiment_label === "Bearish"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {article.sentiment_label}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default NewsSentiment;


