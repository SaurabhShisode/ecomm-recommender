import { useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Gem, Star, Search, Sparkles, Shirt, Cable, XCircle, ChevronDown, CheckCircle, AlertTriangle } from "lucide-react";


const CustomNotification = ({ message, type, onClose }) => {
  if (!message) return null;

  const getStyle = () => {
    switch (type) {
      case 'error':
        return 'bg-red-600 border-red-400';
      case 'info':
        return 'bg-blue-600 border-blue-400';
      case 'success':
        return 'bg-green-600 border-green-400';
      default:
        return 'bg-gray-600 border-gray-400';
    }
  };

  const Icon = type === 'error' ? AlertTriangle : CheckCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl text-white border-b-4 ${getStyle()} flex items-center gap-3 max-w-sm`}
    >
      <Icon className="w-6 h-6 shrink-0" />
      <span className="text-sm font-semibold flex-grow">{message}</span>
      <button onClick={onClose} className="text-white opacity-70 hover:opacity-100 transition-opacity">
        <XCircle className="w-5 h-5" />
      </button>
    </motion.div>
  );
};


const CategoryIcon = ({ category }) => {
  switch (category?.toLowerCase()) {
    case 'books':
      return <BookOpen className="w-5 h-5 text-indigo-300" />;
    case 'beauty':
      return <Gem className="w-5 h-5 text-pink-300" />;
    case 'electronics':
      return <Cable className="w-5 h-5 text-orange-300" />;
    case 'apparel':
      return <Shirt className="w-5 h-5 text-red-300" />;
    default:
      return <Star className="w-5 h-5 text-yellow-300" />;
  }
};

const currentYear = new Date().getFullYear();

const RecommendationCard = ({ rec, index }) => {
  return (
    <motion.div
      className="border border-white/15 bg-white/10 backdrop-blur rounded-2xl p-6 shadow-lg transform transition-all duration-300 group hover:scale-104 cursor-pointer"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex justify-between mb-1">
        <h3 className="text-lg font-semibold text-white pr-4 font-raleway text-left">{rec.title}</h3>
        <div className="p-1 rounded-full ">
          <CategoryIcon category={rec.category} />
        </div>
      </div>

      <p className="text-lg font-bold bg-clip-text bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent mb-3 font-grotesk">
        ₹{rec.price}/-
      </p>
      <p className="text-gray-400 italic text-sm font-poppins">{rec.explanation}</p>
    </motion.div>
  );
};

const CustomKDropdown = ({ kValue, setKValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [4, 8, 12, 16];

  const handleSelect = (value) => {
    setKValue(value);
    setIsOpen(false);
  };

  const dropdownVariants = {
    open: { opacity: 1, y: 0, height: "auto", transition: { type: "spring", bounce: 0, duration: 0.3 } },
    closed: { opacity: 0, y: -10, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white rounded-full text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transform transition duration-200 hover:bg-gray-700 cursor-pointer w-[120px] "
      >
        <span className="font-poppins">Top {kValue}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={dropdownVariants}
        style={{ overflow: 'hidden' }}
        className="absolute top-full mt-4 w-full min-w-[120px] bg-gray-800 border border-indigo-500 rounded-xl shadow-2xl z-40"
      >
        {options.map((k) => (
          <div
            key={k}
            onClick={() => handleSelect(k)}
            className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-150 font-poppins z-40 
              ${k === kValue ? 'bg-indigo-600 font-semibold' : 'hover:bg-gray-700'}`}
          >
            Top {k}
          </div>
        ))}
      </motion.div>
      {isOpen && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white bg-opacity-5 animate-pulse border border-gray-800 rounded-2xl p-6 shadow-lg">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-5 bg-gray-700 rounded w-1/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
  </div>
);

function App() {
  const [userId, setUserId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kValue, setKValue] = useState(8);
  const [notification, setNotification] = useState({ message: null, type: null });

  const notify = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), 4000);
  }, []);

  const getRecs = async () => {
    if (loading) return;
    setLoading(true);
    setRecommendations([]);

    const trimmedUserId = userId.trim();
    if (!trimmedUserId || isNaN(Number(trimmedUserId)) || Number(trimmedUserId) < 1) {
      notify("Please enter a valid numeric User ID (e.g., 17).", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`https://ecomm-recommender-backend.vercel.app/api/recommend`, {
        user_id: trimmedUserId,
        k: kValue,
      });

      setRecommendations(res.data.recommendations || []);
      if (!res.data.recommendations || res.data.recommendations.length === 0) {
        notify(res.data.message || `No new recommendations found for User ${trimmedUserId}.`, "info");
      } else {
        notify(`Successfully loaded ${res.data.recommendations.length} recommendations!`, "success");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        notify(`User ID ${trimmedUserId} not found.`, "error");
      } else {
        notify("Error fetching recommendations! Please check the server connection.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUserId("");
    setRecommendations([]);
    setKValue(8);
    setNotification({ message: null, type: null });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      getRecs();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white overflow-x-hidden">
      <nav className="pt-10 top-5 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center rounded-xl ">

          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgb(129 140 248)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rabbit-icon lucude-rabbit"><path d="M13 16a3 3 0 0 1 2.24 5"/><path d="M18 12h.01"/><path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"/><path d="M20 8.54V4a2 2 0 1 0-4 0v3"/><path d="M7.612 12.524a3 3 0 1 0-1.6 4.3"/></svg>
            <h1 className="text-2xl font-semibold text-white ml-2 font-grotesk">Rabbit</h1>
          </div>


          <a
            href="https://github.com/SaurabhShisode/ecomm-recommender"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.207 11.387c.6.111.793-.261.793-.58v-2.234c-3.338.725-4.033-1.416-4.033-1.416-.547-1.39-1.333-1.76-1.333-1.76-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.836 2.808 1.306 3.493.998.108-.775.418-1.305.762-1.605-2.665-.306-5.466-1.335-5.466-5.932 0-1.31.469-2.381 1.236-3.22-.124-.304-.536-1.527.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.292-1.552 3.297-1.23 3.297-1.23.655 1.65.243 2.873.12 3.176.77.839 1.235 1.91 1.235 3.22 0 4.61-2.804 5.623-5.475 5.922.43.372.823 1.102.823 2.222v3.293c0 .322.19.695.8.578A12.001 12.001 0 0024 12c0-6.627-5.373-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </a>
        </div>
      </nav>
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#2d085a_1px,transparent_1px)] [background-size:32px_32px]"></div>

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-indigo-500 font-grotesk">
            E-commerce Product Recommender
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Personalized for every user. This recommender analyzes users past product interactions to generate a unique list of suggestions.
          </p>
        </motion.div>

        
        <motion.div
          className="max-w-3xl mx-auto p-2 bg-white bg-opacity-10 backdrop-blur-md rounded-full shadow-2xl relative z-30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter user ID (e.g., 17)"
              className="font-poppins w-full px-5 py-3 text-black bg-transparent rounded-full placeholder-gray-400 text-lg focus:outline-none"
            />

            {userId && (
              <button
                onClick={handleClear}
                className="p-3 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/40 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400/50 flex items-center justify-center shrink-0 cursor-pointer"
                title="Clear Search"
              >
                <XCircle className="w-5 h-5"/>
              </button>
            )}
            
            <CustomKDropdown kValue={kValue} setKValue={setKValue} />
            
            

            <button
              onClick={getRecs}
              disabled={loading}
              className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center shrink-0 cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : <Search className="w-5 h-5"/> }
            </button>
          </div>
        </motion.div>

        
        <div className="mt-20">
          <AnimatePresence>
            

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              animate="visible"
            >
              {loading && Array.from({ length: kValue }).map((_, i) => <SkeletonCard key={i} />)}

              {!loading && recommendations.length > 0 &&
                recommendations.map((rec, idx) => (
                  <RecommendationCard key={rec.product_id || idx} rec={rec} index={idx} />
                ))
              }
            </motion.div>
          </AnimatePresence>

          {!loading && recommendations.length === 0 && (
            <motion.div
              className="text-center "
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block p-5 bg-opacity-10 rounded-2xl ">
                 <Sparkles className="w-16 h-16 text-purple-300" />
              </div>
              <h2 className="text-2xl font-bold text-white font-grotesk">Your Recommendations Await</h2>
              <p className="text-gray-400 mt-2 font-poppins">Enter a user ID and click the search button to see personalized results.</p>
            </motion.div>
          )}
        </div>
      </div>
      <footer className="w-full border-white/10 pt-12 pb-6 mt-16 text-white">
        <div className="container mx-auto px-4 mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-6">

          <div className="text-center text-gray-400 text-xs mt-2 md:mt-0">
            &copy; {currentYear} Rabbit. Your Next Favorite, Found.
          </div>

        </div>
        <div className="text-center text-xs text-gray-600 mt-4">
          Made by <a href="https://www.linkedin.com/in/saurabh-shisode-686476248/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Saurabh Shisode</a> | Built with React, Node.js, Express.js and Tailwind CSS
        </div>
      </footer>
      
      <AnimatePresence>
        {notification.message && (
          <CustomNotification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification({ message: null, type: null })} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;