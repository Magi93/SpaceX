import React, { useState, useEffect } from "react";
import data from "./data.json";
function ListView() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [years, setYears] = useState([]);
  const [isLaunchSuccess, setIsLaunchSuccess] = useState(null);
  const [isLandSuccess, setIsLandSuccess] = useState(null);
  const [active, setActive] = useState(null);

  function onYearSelection(y, i) {
    setActive(i);
    setIsLandSuccess(false);
    setIsLaunchSuccess(false);

    fetch(
      "https://api.spaceXdata.com/v3/launches?limit=100&launch_success=true&land_success=true&launch_year=" +
        y
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result !== [] && result.length > 0) setItems(result);
          else {
            let d = data?.filter((m) => m.launch_year === y);
            setItems(d);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );

    return;
  }
  function onLaunchSelection(islaunchSuccess, i) {
    setActive(false);
    setIsLandSuccess(false);
    setIsLaunchSuccess(i);
    fetch(
      "https://api.spaceXdata.com/v3/launches?limit=100&launch_success=" +
        islaunchSuccess
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result !== [] && result.length > 0) setItems(result);
          else {
            let d = data?.filter(
              (m) =>
                m.launch_success === (islaunchSuccess === "True" ? true : false)
            );
            setItems(d);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );

    return;
  }

  function onLandSelection(islandSuccess, i) {
    setIsLandSuccess(i);
    setActive(false);
    setIsLaunchSuccess(false);
    fetch(
      "https://api.spaceXdata.com/v3/launches?limit=100&launch_success=" +
        islandSuccess
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result !== [] && result.length > 0) setItems(result);
          else {
            let d = data?.filter(
              (m) =>
                m?.rocket?.first_stage?.cores[0].land_success ===
                (islandSuccess === "True" ? true : false)
            );
            setItems(d);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );

    return;
  }

  useEffect(() => {
    fetch("https://api.spaceXdata.com/v3/launches?limit=100")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result !== [] && result.length > 0) {
            setItems(result);
            setYears([...new Set(result.map((m) => m.launch_year))]);
          } else {
            setItems(data);
            setYears([...new Set(data.map((m) => m.launch_year))]);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="loader">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="header">
          <h2>SpaceX Launch Programs</h2>
        </div>

        <div className="main-content">
          <div className="leftcolumn">
            <div className="card">
              <h4>Filters</h4>
              <h5 className="launch mt-2">Launch Year</h5>
              <ul>
                {years?.map((year, i) => (
                  <li
                    key={i}
                    onClick={(e) => onYearSelection(year, i)}
                    className={`year ${active === i ? "active" : ""}`}
                  >
                    {year}
                  </li>
                ))}
              </ul>

              <h5 className="launch mt-3">Successful Launch</h5>
              <ul>
                {["True", "False"]?.map((item, i) => (
                  <li
                    key={i}
                    onClick={(e) => onLaunchSelection(item, i)}
                    className={`year ${isLaunchSuccess === i ? "active" : ""}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h5 className="launch mt-3">Successful Landing</h5>
              <ul>
                {["True", "False"]?.map((item, i) => (
                  <li
                    key={i}
                    onClick={(e) => onLandSelection(item, i)}
                    className={`year ${isLandSuccess === i ? "active" : ""}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rightcolumn">
            <div className="row">
              {items?.slice(0, 100).map((item, i) => (
                <div
                  className="col-md-3 flex-column-reverse flex-md-row mb-4"
                  key={i}
                >
                  <div className="card h-100 w-100">
                    <img
                      src={item?.links?.mission_patch}
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {item?.mission_name} #{item?.flight_number}
                      </h5>
                      <ul className="list-group">
                        <li className="list-group-item">
                          Mission ids :
                          <span className="val">
                            {item?.mission_id.length <= 0
                              ? "    - "
                              : " " + item?.mission_id.map((i) => i)}
                          </span>
                        </li>

                        <li className="list-group-item">
                          Launch Year :{" "}
                          <span className="val"> {item?.launch_year}</span>
                        </li>
                        <li className="list-group-item">
                          Successful Launch :
                          <span className="val">
                            {item?.launch_success === true ? " Yes" : " NO"}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Successful Landing :{" "}
                          <span className="val">
                            {item?.rocket?.first_stage?.cores[0]
                              .land_success === true
                              ? " Yes"
                              : " NO"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer">
          <h5>Developed By Mageshwari.E</h5>
        </div>
      </>
    );
  }
}

export default ListView;
