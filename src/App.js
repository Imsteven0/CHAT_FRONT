import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Form from "./components/Form";
import Register from "./components/Register";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Form />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
