

// Works perfect but explore doesnot work
// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./NewRecommenderPage.css";
// import Pagination from "./Pagination";
// import axios from "axios";

// const NewRecommenderPage = () => {
//   const [filters, setFilters] = useState({
//     brand: "",
//     ram: "",
//     storage: "",
//     price_range: "",
//   });
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     count: 0,
//   });

//   const handleFilterChange = (e, filterName) => {
//     setFilters({
//       ...filters,
//       [filterName]: e.target.value,
//     });
//   };

//   const fetchRecommendations = async (page = 1) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const params = new URLSearchParams({
//         ...filters,
//         page: page,
//       }).toString();

//       const response = await axios.get(
//         `http://localhost:8000/api/recommend/?${params}`
//       );

//       console.log(response);
//       console.log(response.data.id);

//       setRecommendations(response.data || []); 

//       setPagination({
//         currentPage: response.data?.current_page || 1,
//         totalPages: response.data?.total_pages || 1,
//         count: response.data?.count || 0,
//       });

//     } catch (err) {
//       setError(err.message);
//       setRecommendations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     fetchRecommendations(1);
//   };

//   const handlePageChange = (page) => {
//     fetchRecommendations(page);
//   };

//   return (
//     <div className="container-fluid min-vh-100 d-flex flex-column">
//       <header className="text-center my-4">
//         <h1 className="display-8 text-warning">Product Recommendations</h1>
//       </header>

//       <main className="container py-5">
//         <div className="filters-container mb-4 d-flex justify-content-center">
//           <div className="filter-group d-flex flex-wrap justify-content-between gap-3">
//             {[
//               {
//                 name: "brand",
//                 options: ["", "Samsung", "Apple", "OnePlus", "Xiaomi"],
//               },
//               {
//                 name: "ram",
//                 options: ["", "3GB", "4GB", "6GB", "8GB", "12GB"],
//               },
//               {
//                 name: "storage",
//                 options: ["", "64GB", "128GB", "256GB", "512GB"],
//               },
//               {
//                 name: "price_range",
//                 options: [
//                   "",
//                   "$200 - $400",
//                   "$400 - $600",
//                   "$600 - $800",
//                   "$800+",
//                 ],
//               },
//             ].map((filter, index) => (
//               <div className="filter-card flex-fill" key={index}>
//                 <label className="d-block text-white">{filter.name}</label>
//                 <select
//                   className="form-control mt-1 custom-select py-1"
//                   value={filters[filter.name]}
//                   onChange={(e) => handleFilterChange(e, filter.name)}
//                 >
//                   {filter.options.map((option, i) => (
//                     <option key={i} value={option}>
//                       {option || `Select ${filter.name}`}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="d-flex justify-content-center">
//           <button
//             className="btn btn-primary search-btn"
//             onClick={handleSearch}
//             disabled={loading}
//           >
//             {loading ? "Searching..." : "Search"}
//           </button>
//         </div>

//         {error && <div className="alert alert-danger mt-3">{error}</div>}

//         <div className="list-group mt-5">
//           <h2 className="text-center my-4 text-white">
//             Recommendations ({pagination.count})
//           </h2>

//           {loading ? (
//             <div className="text-center">
//               <div className="spinner-border text-warning" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : recommendations.length > 0 ? (
//             recommendations.map((mobile, index) => (
//               <div
//                 className="list-group-item bg-dark text-white mb-3"
//                 key={mobile.id}
//               >
//                 <div className="d-flex align-items-center justify-content-between">
//                   <div className="d-flex gap-3 align-items-center">
//                     {/* ✅ FIXED: Changed `device` to `mobile` to match the variable inside .map() */}
//                     <img
//                       src={mobile.picture || "https://via.placeholder.com/60"}  
//                       alt={mobile.name || "Unknown Device"}
//                       width="60"
//                       className="rounded"
//                     />
//                     <div>
//                       <p className="mb-0">{mobile.name || "Unknown Name"}</p>
//                       <small className="text-muted">{mobile.chipset || "Unknown Chipset"}</small>
//                       <div className="mt-1">
//                         <small className="text-info">
//                           {mobile.ram || "N/A"} RAM • {mobile.storage || "N/A"} • {mobile.price || "Price Not Available"}
//                         </small>
//                       </div>
//                     </div>
//                   </div>
//                   <button className="btn btn-outline-warning">Explore</button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             !loading && (
//               <div className="text-center text-white py-4">
//                 No recommendations found. Try different filters.
//               </div>
//             )
//           )}
//         </div>

//         {pagination.totalPages > 1 && (
//           <Pagination
//             currentPage={pagination.currentPage}
//             totalPages={pagination.totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </main>
//     </div>
//   );
// };

// export default NewRecommenderPage;

// FYP code
// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./NewRecommenderPage.css";
// import Pagination from "./Pagination";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // ✅ NEW
// const resultsPerPage = 5;


// const NewRecommenderPage = () => {
//   const [filters, setFilters] = useState({
//     brand: "",
//     ram: "",
//     storage: "",
//     price_range: "",
//   });
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     count: 0,
//   });

//   const navigate = useNavigate(); // ✅ NEW

//   const handleFilterChange = (e, filterName) => {
//     setFilters({
//       ...filters,
//       [filterName]: e.target.value,
//     });
//   };

//   const fetchRecommendations = async (page = 1) => {
//     setLoading(true);
//     setError(null);

//     try {
//   const params = new URLSearchParams({
//     ...filters,
//     page: page,
//   }).toString();

//   const response = await axios.get(
//     `http://localhost:8000/api/recommend/?${params}`
//   );

//   console.log(response.data); // Debug: log array

//   // ✅ Handle plain array of recommendations
//   setRecommendations(response.data || []);

//   // ✅ Manually compute count using array length
//   setPagination({
//     currentPage: 1,
//     totalPages: 1,
//     count: (response.data || []).length,
//   });

// } catch (err) {
//   setError(err.message);
//   setRecommendations([]);
// } finally {
//   setLoading(false);
// }

//   };

//   const handleSearch = () => {
//     fetchRecommendations(1);
//   };

//   const handlePageChange = (page) => {
//     fetchRecommendations(page);
//   };
  

//   return (
//     <div className="container-fluid min-vh-100 d-flex flex-column">
//       <header className="text-center my-4">
//         <h1 className="display-8 text-warning">Product Recommendations</h1>
//       </header>

//       <main className="container py-5">
//         <div className="filters-container mb-4 d-flex justify-content-center">
//           <div className="filter-group d-flex flex-wrap justify-content-between gap-3">
//             {[
//               {
//                 name: "brand",
//                 options: ["", "Samsung", "Apple", "OnePlus", "Xiaomi"],
//               },
//               {
//                 name: "ram",
//                 options: ["", "3GB", "4GB", "6GB", "8GB", "12GB"],
//               },
//               {
//                 name: "storage",
//                 options: ["", "64GB", "128GB", "256GB", "512GB"],
//               },
//               {
//                 name: "price_range",
//                 options: [
//                   "",
//                   "$200 - $400",
//                   "$400 - $600",
//                   "$600 - $800",
//                   "$800+",
//                 ],
//               },
//             ].map((filter, index) => (
//               <div className="filter-card flex-fill" key={index}>
//                 <label className="d-block text-white">{filter.name}</label>
//                 <select
//                   className="form-control mt-1 custom-select py-1"
//                   value={filters[filter.name]}
//                   onChange={(e) => handleFilterChange(e, filter.name)}
//                 >
//                   {filter.options.map((option, i) => (
//                     <option key={i} value={option}>
//                       {option || `Select ${filter.name}`}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="d-flex justify-content-center">
//           <button
//             className="btn btn-primary search-btn"
//             onClick={handleSearch}
//             disabled={loading}
//           >
//             {loading ? "Searching..." : "Search"}
//           </button>
//         </div>

//         {error && <div className="alert alert-danger mt-3">{error}</div>}

//         <div className="list-group mt-5">
//           <h2 className="text-center my-4 text-white">
//             Recommendations ({pagination.count})
//           </h2>

//           {loading ? (
//             <div className="text-center">
//               <div className="spinner-border text-warning" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : recommendations.length > 0 ? (
//             recommendations.map((mobile, index) => (
//               <div
//                 className="list-group-item bg-dark text-white mb-3"
//                 key={mobile.id}
//               >
//                 <div className="d-flex align-items-center justify-content-between">
//                   <div className="d-flex gap-3 align-items-center">
//                     <img
//                       src={mobile.picture || "https://via.placeholder.com/60"}
//                       alt={mobile.name || "Unknown Device"}
//                       width="60"
//                       className="rounded"
//                     />
//                     <div>
//                       <p className="mb-0">{mobile.name || "Unknown Name"}</p>
//                       <small className="text-muted">
//                         {mobile.chipset || "Unknown Chipset"}
//                       </small>
//                       <div className="mt-1">
//                         <small className="text-info">
//                           {mobile.ram || "N/A"} RAM • {mobile.storage || "N/A"} •{" "}
//                           {mobile.price || "Price Not Available"}
//                         </small>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     className="btn btn-outline-warning"
//                     onClick={() =>
//                       navigate("/analyzerpage", {
//                         state: { productName: mobile.name },
//                       })
//                     }
//                   >
//                     Explore
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             !loading && (
//               <div className="text-center text-white py-4">
//                 No recommendations found. Try different filters.
//               </div>
//             )
//           )}
//         </div>

//         {pagination.totalPages > 1 && (
//           <Pagination
//             currentPage={pagination.currentPage}
//             totalPages={pagination.totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </main>
//     </div>
//   );
// };

// export default NewRecommenderPage;



import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NewRecommenderPage.css";
import Pagination from "./Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewRecommenderPage = () => {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  
  const [filters, setFilters] = useState({
    brand: "",
    ram: "",
    storage: "",
    price_range: "",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    count: 0,
  });

  const navigate = useNavigate();

  const handleFilterChange = (e, filterName) => {
    setFilters({
      ...filters,
      [filterName]: e.target.value,
    });
  };

  const fetchRecommendations = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...filters,
        page: page,
      }).toString();

      const response = await axios.get(
        `http://localhost:8000/api/recommend/?${params}`
      );

      console.log("Fetched data:", response.data);

      setRecommendations(response.data || []);

      setPagination({
        currentPage: page,
        totalPages: Math.ceil((response.data || []).length / 5),
        count: (response.data || []).length,
      });
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRecommendations(1);
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <header className="text-center my-4">
        <h1 className="display-8 text-warning">Product Recommendations</h1>
      </header>

      <main className="container py-5">
        <div className="filters-container mb-4 d-flex justify-content-center">
          <div className="filter-group d-flex flex-wrap justify-content-between gap-3">
            {[
              {
                name: "brand",
                options: ["", "Samsung", "Apple", "Google Pixel"],
              },
              {
                name: "ram",
                options: ["", "3GB", "4GB", "6GB", "8GB", "12GB"],
              },
              {
                name: "storage",
                options: ["", "64GB", "128GB", "256GB", "512GB"],
              },
              {
                name: "price_range",
                options: [
                  "",
                  "$200 - $400",
                  "$400 - $600",
                  "$600 - $800",
                  "$800+",
                ],
              },
            ].map((filter, index) => (
              <div className="filter-card flex-fill" key={index}>
                <label className="d-block text-white">{filter.name}</label>
                <select
                  className="form-control mt-1 custom-select py-1"
                  value={filters[filter.name]}
                  onChange={(e) => handleFilterChange(e, filter.name)}
                >
                  {filter.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option || `Select ${filter.name}`}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="list-group mt-5">
          <h2 className="text-center my-4 text-white">
            Recommendations ({pagination.count})
          </h2>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : recommendations.length > 0 ? (
            recommendations
              .slice(
                (pagination.currentPage - 1) * 5,
                pagination.currentPage * 5
              )
              .map((mobile) => (
                <div
                  className="list-group-item bg-dark text-white mb-3"
                  key={mobile.id}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={
                          mobile.picture || "https://via.placeholder.com/60"
                        }
                        alt={mobile.name || "Unknown Device"}
                        width="60"
                        className="rounded"
                      />
                      <div>
                        <p className="mb-0">{mobile.name || "Unknown Name"}</p>
                        <small className="text-muted">
                          {mobile.chipset || "Unknown Chipset"}
                        </small>
                        <div className="mt-1">
                          <small className="text-info">
                            {mobile.ram || "N/A"} RAM •{" "}
                            {mobile.storage || "N/A"} •{" "}
                            {mobile.price || "Price Not Available"}
                          </small>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/analyzerpage", {
                          state: { productName: mobile.name },
                        })
                      }
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))
          ) : (
            !loading && (
              <div className="text-center text-white py-4">
                No recommendations found. Try different filters.
              </div>
            )
          )}
        </div>

        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};

export default NewRecommenderPage;
