
import React, { useState ,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ComparisonPage.css";

const NewComparisonPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [device1, setDevice1] = useState("");
  const [device2, setDevice2] = useState("");
  const [deviceData1, setDeviceData1] = useState(null);
  const [deviceData2, setDeviceData2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false); // for spinner
  const [error, setError] = useState("");

  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);


  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/comparison/compare/?suggest=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        setSuggestions([]);
        return;
      }
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions([]);
    }
  };

  
  const handleSearch = async () => {
  setError("");

  if (!device1.trim() || !device2.trim()) {
    setError("Please enter both device names.");
    return;
  }
  

  if (device1.trim().toLowerCase() === device2.trim().toLowerCase()) {
    setError("Enter two different products to compare.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost:8000/comparison/compare/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device1, device2 }),
    });

    if (!response.ok) throw new Error("Failed to fetch comparison data.");
    const data = await response.json();

    if (!data.device1 || !data.device2) {
      setError("One or both devices not found in the database.");
      setDeviceData1(null);
      setDeviceData2(null);
    } else {
      setDeviceData1(data.device1);
      setDeviceData2(data.device2);
      setAnalyzing(true);

      Promise.all([
        fetch(
          `http://127.0.0.1:8000/datafetch/fetch-data/?brand=${encodeURIComponent(data.device1.brand || "")}&search=${encodeURIComponent(data.device1.name || "")}`
        ).then((res) => res.json()),
        fetch(
          `http://127.0.0.1:8000/datafetch/fetch-data/?brand=${encodeURIComponent(data.device2.brand || "")}&search=${encodeURIComponent(data.device2.name || "")}`
        ).then((res) => res.json()),
      ]).then(([sentiment1, sentiment2]) => {
        setDeviceData1((prev) => ({
          ...prev,
          positive: Math.round(sentiment1.positive_percentage),
          negative: 100 - Math.round(sentiment1.positive_percentage),
        }));
        setDeviceData2((prev) => ({
          ...prev,
          positive: Math.round(sentiment2.positive_percentage),
          negative: 100 - Math.round(sentiment2.positive_percentage),
        }));
        setAnalyzing(false);
      });
    }
  } catch (err) {
    setError(err.message || "An unexpected error occurred.");
    setDeviceData1(null);
    setDeviceData2(null);
  } finally {
    setLoading(false);
  }
};

  const renderRows = () => {
    if (!deviceData1 || !deviceData2) return null;
    const keys = [
      { label: "Name", key: "name" },
      { label: "Operating System", key: "os" },
      { label: "RAM", key: "ram" },
      { label: "Storage", key: "storage" },
      { label: "Battery", key: "battery_size" },
      { label: "Camera", key: "camera_pixels" },
      { label: "Chipset", key: "chipset" },
      { label: "Display Size", key: "display_size" },
      { label: "Resolution", key: "display_resolution" },
    ];

    return keys.map(({ label, key }) => (
      <tr key={key}>
        <td>{label}</td>
        <td>{deviceData1[key] || "-"}</td>
        <td>{deviceData2[key] || "-"}</td>
      </tr>
    ));
  };

  const renderProductCard = (deviceData) => {
    if (!deviceData) return null;
    return (
      <div className="product-card d-flex align-items-center gap-3 mb-3">
        <img
          src={deviceData.picture || "https://via.placeholder.com/100"}
          alt={deviceData.name}
          className="img-thumbnail"
          width="100"
        />
        <div>
          <p className="mb-0">{deviceData.name}</p>
          <small className="text-white">
            {deviceData.price ? `$${deviceData.price}` : "Price not available"}
          </small>
        </div>
      </div>
    );
  };

  const renderSentimentCard = (device, index) => (
    <div className="col-md-6 text-light" key={index}>
      <div className="card sentiment-card shadow text-light p-3">
        <h5 className="text-shadow text-warning">{device.name}</h5>
        <div className="d-flex justify-content-between mb-3">
          <div className="text-center">
            <h6>Positive Reviews</h6>
            <p className="display-5 text-success">
              {Math.round(device.positive)}%
            </p>
          </div>
          <div className="text-center">
            <h6>Negative Reviews</h6>
            <p className="display-5 text-danger">
              {Math.round(device.negative)}%
            </p>
          </div>
        </div>
        <div>
          <p>Features</p>
          <div className="progress mb-2">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${100 - index * 10}%` }}
            ></div>
          </div>
          <p>Design</p>
          <div className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${90 - index * 5}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="comparison-page container-fluid bg-dark text-white min-vh-100 d-flex flex-column">
      <div className="comparison-header py-4 mt-2 text-light">
        <div className="container">
          <h3 className="text-center text-shadow bold-text text-warning">
            Product Comparison
          </h3>
        </div>
      </div>

      <main className="container flex-grow-1 d-flex flex-column py-5">
        <div className="row g-4">
          <aside className="col-md-3 bg-dark p-4 rounded shadow border-0">
            <h3 className="mb-4 text-shadow text-warning">Compare a Product</h3>
            <div className="row g-3">
              <div className="col-12" style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control input-styled"
                  placeholder="Enter first product"
                  value={device1}
                  onChange={(e) => {
                    setDevice1(e.target.value);
                    fetchSuggestions(e.target.value, setSuggestions1);
                  }}
                  autoComplete="off"
                />
                {suggestions1.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions1.map((sugg, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setDevice1(sugg);
                          setSuggestions1([]);
                        }}
                        className="suggestion-item"
                      >
                        {sugg}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-12" style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control input-styled"
                  placeholder="Compare with"
                  value={device2}
                  onChange={(e) => {
                    setDevice2(e.target.value);
                    fetchSuggestions(e.target.value, setSuggestions2);
                  }}
                  autoComplete="off"
                />
                {suggestions2.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions2.map((sugg, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setDevice2(sugg);
                          setSuggestions2([]);
                        }}
                        className="suggestion-item"
                      >
                        {sugg}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-12">
                <button
                  className="btn btn-yellow btn-hover w-100"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Search"}
                </button>
              </div>
              {error && <div className="col-12 text-danger mt-2">{error}</div>}
            </div>
          </aside>

          <section className="col-md-9">
            {(deviceData1 || deviceData2) && (
              <>
                <h4 className="text-shadow text-warning">Products</h4>
                {renderProductCard(deviceData1)}
                {renderProductCard(deviceData2)}
              </>
            )}

            {deviceData1 && deviceData2 ? (
              <>
                <h4 className="text-shadow text-warning">Compare Products</h4>
                <table className="table table-dark table-striped table-hover table-bordered mt-3 shadow">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>{deviceData1.name}</th>
                      <th>{deviceData2.name}</th>
                    </tr>
                  </thead>
                  <tbody>{renderRows()}</tbody>
                </table>

                <h4 className="mt-4 text-shadow text-warning">Sentiment Analysis</h4>
                {analyzing ? (
                  <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-warning mb-3" style={{ width: "4rem", height: "4rem" }} role="status">
                      <span className="visually-hidden">Analyzing...</span>
                    </div>
                    <p className="text-warning">Sentiment analysis loading...</p>
                  </div>
                ) : (
                  <div className="row g-3 text-light">
                    {renderSentimentCard(deviceData1, 0)}
                    {renderSentimentCard(deviceData2, 1)}
                  </div>
                )}
              </>
            ) : (
              <p
  className="text-light"
  style={{
    textAlign: "center",
    paddingLeft: "30px", // shift right slightly
  }}
>
  Enter device names and click <strong>Search</strong> to compare.
</p>

            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default NewComparisonPage;
