// import NewsSentiment from "../components/NewsSentiment";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const tickers = ["AAPL", "MSFT", "TSLA"]; // Replace with dynamic user portfolio tickers

// const NewsSentimentPage = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header />
//       <main className="flex flex-col items-center justify-start flex-grow p-4">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
//           News Sentiment
//         </h1>
//         <p className="text-lg text-gray-600 leading-relaxed max-w-3xl text-center mb-6">
//           Stay updated with the latest news and sentiment for your portfolio
//           stocks.
//         </p>
//         <NewsSentiment tickers={tickers} />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default NewsSentimentPage;





import React from "react";
import { useAuth } from "../context/UserContext";
import NewsSentiment from "../components/NewsSentiment";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewsSentimentPage = () => {
  const { currentUser } = useAuth(); // Access authenticated user

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center justify-start flex-grow p-4">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Latest News
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl text-center mb-6">
          Stay updated with the latest news and sentiment for your portfolio
          stocks.
        </p>
        {currentUser ? (
          <NewsSentiment userId={currentUser.uid} />
        ) : (
          <p className="text-red-500">Please log in to view your portfolio news.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsSentimentPage;


