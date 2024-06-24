import { BrowserRouter } from "react-router-dom";
import EventRoutes from "./EventRoutes";

function App() {
  return (
    <BrowserRouter>
      <EventRoutes />
    </BrowserRouter>
  );
}

export default App;
