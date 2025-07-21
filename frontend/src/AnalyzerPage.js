// FYP LEVEL CODE BELOW

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";


const ProductAnalyzer = () => {
  const [calculating, setCalculating] = useState(true);
  const [brand, setBrand] = useState("Samsung");
  const [searchTerm, setSearchTerm] = useState("");
  const [productData, setProductData] = useState(null);
  const [AnalysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [FiveStars, setFiveStars] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoFetchDone, setAutoFetchDone] = useState(false);
  const [showAutoSpinner, setShowAutoSpinner] = useState(false);
  const autocompleteTimeoutRef = useRef(null);
  const [showRagQuestions, setShowRagQuestions] = useState(false);
  const [ragAnswer, setRagAnswer] = useState("");
  const [ragLoading, setRagLoading] = useState(false);
  const [loadingShops, setLoadingShops] = useState(false);
  const [nearbyShops, setNearbyShops] = useState([]);

  const location = useLocation();
  const productName = location.state?.productName;

  const ragQuestions = [
    "As a normal user how will the battery perform",
    "Is the display good for outdoor use?",
    "How well does the camera perform in low light?",
    "Does the phone heat up during gaming?",
    "Is the phone a good daily driver and why"
  ];

  const handleRagQuestion = async (question) => {
    setRagLoading(true);
    setRagAnswer("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/rag/get-answer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: searchTerm, question }),
      });
      const data = await response.json();
      setRagAnswer(data.answer || "No answer generated.");
    } catch (error) {
      console.error("Error calling RAG API:", error);
      setRagAnswer("Error generating answer.");
    } finally {
      setRagLoading(false);
    }
  };


  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  const fetchAutocompleteSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/comparison/autocomplete_analyzer_page/?suggest=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching autocomplete suggestions:", err);
    }
  };

  useEffect(() => {
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current);
    }
    autocompleteTimeoutRef.current = setTimeout(() => {
      fetchAutocompleteSuggestions(searchTerm);
    }, 300);
    return () => clearTimeout(autocompleteTimeoutRef.current);
  }, [searchTerm]);

  const fetchProductData = async () => {
    setLoading(true);
    setCalculating(true);
    setError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/datafetch/fetch-data/?brand=${encodeURIComponent(brand)}&search=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) throw new Error("Product not found");

      const data = await response.json();
      setFiveStars((data.positive_percentage / 100) * 5);

      if (data.results) {
        setAnalysisData(data.results);
      } else {
        setError(" ");
      }

      const metaResponse = await fetch(
        `http://127.0.0.1:8000/comparison/autocomplete_analyzer_page/?device_name=${encodeURIComponent(searchTerm)}`
      );
      const metaData = await metaResponse.json();

      if (metaData.device) {
        setProductData(metaData.device);
      } else {
        setProductData(null);
        console.warn("No product metadata found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch product data");
    } finally {
      setCalculating(false);
      setLoading(false);
      setShowSuggestions(false);
      setShowAutoSpinner(false); // Hide overlay spinner after automatic fetch
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setLoading(true);
    setError(null);

    fetch(
      `http://127.0.0.1:8000/comparison/autocomplete_analyzer_page/?device_name=${encodeURIComponent(suggestion)}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.device) {
          setProductData(data.device);
          setError(null);
        } else {
          setProductData(null);
          setError("Device details not found");
        }
      })
      .catch(() => {
        setProductData(null);
        setError("Failed to fetch device details");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoadingShops(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/others/get-location/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });

          const data = await res.json();
          if (data.shops_nearby && Array.isArray(data.shops_nearby)) {
            setNearbyShops(data.shops_nearby);
          }
        } catch (err) {
          console.error("Location API failed:", err);
        } finally {
          setLoadingShops(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoadingShops(false);
      }
    );
  }, []);

  useEffect(() => {
    if (productName && !autoFetchDone) {
      setSearchTerm(productName);
      setShowAutoSpinner(true); // Show overlay spinner
      setAutoFetchDone(true);
    }
  }, [productName]);

  useEffect(() => {
    if (autoFetchDone && searchTerm) {
      fetchProductData();
    }
  }, [autoFetchDone, searchTerm]);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#121212] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col bg-gradient-to-b from-[#17170F] to-[#2c2c2c]">
        <div className="px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-center gap-4 p-6 text-center">
              <p
                className="text-6xl font-extrabold leading-tight tracking-[-0.02em] min-w-72"
                style={{ color: "#ffc107" }}
              >
                Product Analyzer
              </p>
            </div>

            {/* BRAND + SEARCH UI */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
              <div className="filter-group d-flex flex-wrap justify-content-between gap-3">
                {[{ name: "Brand", options: ["Samsung", "Apple", "google pixel"] }].map(
                  (filter, index) => (
                    <div className="filter-card flex-fill" key={index}>
                      <label className="d-block text-white">{filter.name}</label>
                      <select
                        className="form-control mt-1 custom-select py-1"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      >
                        {filter.options.map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
              </div>

              <label className="flex flex-col flex-1 min-w-[200px] relative">
                <p className="text-lg font-medium" style={{ color: "#ffc107" }}>
                  Search
                </p>
                <input
                  placeholder="iPhone Xs Max"
                  className="form-input w-full rounded-xl text-white bg-[#4b4020] hover:bg-[#3a331e] focus:outline-none focus:ring-2 focus:ring-[#FFD661] h-12 placeholder:text-[#cebd8d] p-4 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchProductData()}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full z-10 bg-[#2c2c2c] border border-[#ffd562] rounded-xl mt-1 max-h-48 overflow-auto">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="cursor-pointer px-4 py-2 text-white hover:bg-[#3a331e]"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </label>

              <div className="w-full sm:w-auto flex justify-end mt-9">
                <button
                  onClick={fetchProductData}
                  disabled={loading}
                  className="flex items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#FFD661] text-black font-bold transition-all duration-300 ease-in-out hover:bg-[#e0a900] shadow-md"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {error && <div className="px-6 text-red-500">{error}</div>}

            {productData ? (
              <>
                {/* Product Info Card */}
                <div className="p-6">
                  <div className="flex items-stretch justify-between gap-4 rounded-xl bg-[#2a2920] shadow-xl">
                    <div
                      className="w-[220px] h-[350px] bg-center bg-no-repeat bg-cover rounded-xl flex-1"
                      style={{ backgroundImage: `url(${productData.picture})` }}
                    ></div>
                    <div className="flex flex-col gap-2 flex-[2_2_0px] p-6">
                      <p className="text-white text-3xl font-bold leading-tight">
                        {productData.name}
                      </p>
                      <p className="text-[#FFD661] text-lg font-normal leading-normal">
                        Released: {productData.released_at}
                      </p>
                      <p className="text-white text-sm font-normal leading-normal">
                        {`The ${productData.name} features a sleek design with a ${productData.display_size} display (${productData.display_resolution}), powered by the ${productData.chipset}. Running on ${productData.os}, it comes with ${productData.ram}, a ${productData.battery_size} ${productData.battery_type} battery, and a ${productData.camera_pixels} camera.`}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-white text-2xl font-bold pt-6">Overall Rating</h3>
                  <div className="flex flex-col gap-3 p-4 bg-[#1e1d1a] rounded-xl shadow-md">
                    <div className="flex gap-6 justify-between">
                     {calculating ? (
  <p className="text-[#FFD661] flex items-center gap-2">
    <span className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
    Calculating...
  </p>
) : (
  <p className="text-white text-lg font-medium">
    {`${FiveStars?.toFixed(1)} out of 5 stars`}
  </p>
)}

                    </div>
                    <div className="rounded bg-[#6b5b2e]">
                      <div
                        className="h-2 rounded bg-[#ffd562]"
                        style={{ width: `${(FiveStars / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* RAG + Nearby */}
                <div className="mt-6 p-6 bg-[#1e1d1a] rounded-xl shadow-lg">
                  <h2 className="text-[#FFD661] text-2xl font-bold mb-4">RAG Assistant</h2>
                  <button
                    onClick={() => setShowRagQuestions(!showRagQuestions)}
                    className="mb-4 bg-[#FFD661] text-black px-4 py-2 rounded hover:bg-[#e0a900] font-bold"
                  >
                    {showRagQuestions ? "Hide RAG Assistant" : "Use RAG Assistant"}
                  </button>

                  {showRagQuestions && (
                    <div className="flex flex-col gap-4">
                      <select
                        className="bg-[#2c2c2c] text-white rounded p-2 border border-[#FFD661]"
                        onChange={(e) => handleRagQuestion(e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a question
                        </option>
                        {ragQuestions.map((q, index) => (
                          <option key={index} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>

                      {ragLoading ? (
                        <p className="text-[#FFD661]">Generating answer...</p>
                      ) : ragAnswer ? (
                        <div className="bg-[#2a2920] p-4 rounded text-white">
                          <strong>Answer:</strong>
                          <p className="mt-2">{ragAnswer}</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Nearby Shops */}
                <div className="mt-6 p-6 bg-[#2c2c2c] rounded-xl shadow-lg">
                  <h2 className="text-[#FFD661] text-2xl font-bold mb-4">Nearby Mobile Shops</h2>

                  {loadingShops ? (
                    <div className="text-white flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      <p>Fetching nearby shops...</p>
                    </div>
                  ) : nearbyShops.length > 0 ? (
                    <div className="flex overflow-x-auto gap-3">
                      {nearbyShops.map((shop, i) => (
                        <div
                          key={i}
                          className="bg-[#1e1d1a] text-white rounded p-3 min-w-[200px] shadow-md"
                        >
                          {shop.title}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No shops found nearby.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-400">
                {!error && "Search for a product to see details"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalyzer;


