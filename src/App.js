import React from "react";
import "./App.css";
import ListView from "./ListView";

function App() {
  const show = true;

  return show ? (
    <ListView /> //still instantiated
  ) : (
    <Loader />
  );
}
function Loader() {
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
}
export default App;
