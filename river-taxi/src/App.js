// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Home from "./pages/Home"; // Ваша домашняя страница
// import OrderForm from "./pages/OrderForm"; // Страница оформления заказа
// import OrdersManagement from "./pages/OrdersManagement"; // Страница управления заказами
// import TripTracking from "./pages/TripTracking"; // Страница отслеживания поездки
// import { Box, Button } from "@mui/material";

// function App() {
//   // Состояние для заказов
//   const [orders, setOrders] = useState([]);

//   // Функция для добавления нового заказа
//   const addOrder = (order) => {
//     setOrders((prevOrders) => [...prevOrders, order]);
//   };

//   return (
//     <Router>
//       <Box sx={{ padding: "20px", backgroundColor: "#e3f2fd" }}>
//         {/* Навигация между страницами */}
//         <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
//           <Link to="/" style={{ textDecoration: 'none' }}>
//             <Button variant="contained" color="primary">
//               Главная
//             </Button>
//           </Link>
//           <Link to="/order" style={{ textDecoration: 'none' }}>
//             <Button variant="contained" color="primary">
//               Оформить заказ
//             </Button>
//           </Link>
//           <Link to="/management" style={{ textDecoration: 'none' }}>
//             <Button variant="contained" color="primary">
//               Управление заказами
//             </Button>
//           </Link>
//           <Link to="/tracking" style={{ textDecoration: 'none' }}>
//             <Button variant="contained" color="primary">
//               Отслеживание поездки
//             </Button>
//           </Link>
//         </Box>

//         {/* Основной контент страниц */}
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/order" element={<OrderForm addOrder={addOrder} />} />
//           <Route path="/management" element={<OrdersManagement orders={orders} />} />
//           <Route path="/tracking" element={<TripTracking />} />
//         </Routes>
//       </Box>
//     </Router>
//   );
// }

// export default App;
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import OrderForm from "./pages/OrderForm";
import OrdersManagement from "./pages/OrdersManagement";
import TripTracking from "./pages/TripTracking";
import { Box, Button } from "@mui/material";


// Данные о причалах
const docks = [
  { name: "Парк Горького", latitude: 55.73013, longitude: 37.597184 },
  { name: "Нескучный сад", latitude: 55.722427, longitude: 37.590694 },
  { name: "Крымский мост", latitude: 55.732427, longitude: 37.596061 },
  { name: "Марьино", latitude: 55.641785, longitude: 37.760000 },
];

function App() {
  const [orders, setOrders] = useState([]);

  return (
    <Router>
      <Box sx={{ padding: "20px", backgroundColor: "#e3f2fd" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">Главная</Button>
          </Link>
          <Link to="/order" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">Оформить заказ</Button>
          </Link>
          <Link to="/management" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">Управление заказами</Button>
          </Link>
          <Link to="/tracking" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">Отслеживание</Button>
          </Link>
        </Box>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<OrderForm docks={docks} setOrders={setOrders} />} />
          <Route path="/management" element={<OrdersManagement orders={orders} />} />
          <Route path="/tracking/:orderNumber" element={<TripTracking orders={orders} />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
