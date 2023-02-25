import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Verify from "./pages/Verify";
import Agreement from "./pages/Agreement";

const App = () => {
  let agreed = localStorage.getItem("agreed") === "yes";

  return (
    <BrowserRouter>
      <Routes>
        {agreed && (
          <Route path="/" element={<Home />} />
        )}

        {!agreed && <Route path="*" element={<Agreement />} />}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
