// import React, { useState } from "react";
// import { TextField, Button, Box, Typography } from "@mui/material";
// import L from "leaflet"; // Для карты

// function TripTracking({ orders }) {
//   const [orderNumber, setOrderNumber] = useState(""); // Номер заказа
//   const [orderDetails, setOrderDetails] = useState(null); // Детали заказа для отображения

//   // Функция для поиска заказа по номеру
//   const findOrderByNumber = (number) => {
//     if (!orders || orders.length === 0) {
//       alert("Нет доступных заказов для отслеживания.");
//       return null;
//     }
//     return orders.find((order) => order.orderNumber === parseInt(number, 10));
//   };

//   // Отображение карты и маршрута
//   const displayRoute = (order) => {
//     const mapInstance = L.map("order-map", {
//       center: [55.73013, 37.597184], // Позиция по умолчанию (можно изменить на нужную)
//       zoom: 12,
//       attributionControl: false,
//     });

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "",
//     }).addTo(mapInstance);

//     L.Routing.control({
//       waypoints: [
//         L.latLng(order.startPoint), // Начальная точка
//         L.latLng(order.endPoint), // Конечная точка
//       ],
//       createMarker: () => null, // Отключаем маркеры
//       routeWhileDragging: true,
//     }).addTo(mapInstance);
//   };

//   // Обработчик поиска заказа
//   const handleTrackOrder = () => {
//     const order = findOrderByNumber(orderNumber);
//     if (order) {
//       setOrderDetails(order); // Отображаем детали заказа
//       displayRoute(order); // Отображаем маршрут на карте
//     } else {
//       alert("Заказ с таким номером не найден.");
//     }
//   };

//   return (
//     <Box sx={{ padding: "20px" }}>
//       <Typography variant="h4" gutterBottom>
//         Отслеживание заказа
//       </Typography>

//       <TextField
//         label="Номер заказа"
//         variant="outlined"
//         value={orderNumber}
//         onChange={(e) => setOrderNumber(e.target.value)}
//         sx={{ marginBottom: "20px" }}
//       />
//       <Button variant="contained" color="primary" onClick={handleTrackOrder}>
//         Отследить
//       </Button>

//       {orderDetails && (
//         <Box sx={{ marginTop: "20px" }}>
//           <Typography variant="h6">Детали заказа</Typography>
//           <Typography variant="body1">
//             Номер заказа: {orderDetails.orderNumber}
//           </Typography>
//           <Typography variant="body1">Клиент: {orderDetails.customerName}</Typography>
//           <Typography variant="body1">Дата: {orderDetails.date}</Typography>
//           <Typography variant="body1">Начальная точка: {orderDetails.startPoint}</Typography>
//           <Typography variant="body1">Конечная точка: {orderDetails.endPoint}</Typography>

//           <div id="order-map" style={{ height: "400px", marginTop: "20px" }}></div>
//         </Box>
//       )}
//     </Box>
//   );
// }

// export default TripTracking;
import React, { useState, useEffect, useCallback } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

function TripTracking({ orders }) {
  const { orderNumber } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Функция для поиска заказа по номеру (мемоизирована с useCallback)
  const findOrderByNumber = useCallback((number) => {
    return orders.find((order) => order.orderNumber === number);
  }, [orders]);

  // Инициализация карты
  const initializeMap = () => {
    const map = L.map("map", {
      center: [55.73013, 37.597184], // стартовая позиция карты
      zoom: 12,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    setMapInstance(map);
  };

  useEffect(() => {
    // Инициализация карты, если ее еще нет
    if (!mapInstance) {
      initializeMap();
    }

    // Поиск заказа по номеру
    const order = findOrderByNumber(orderNumber);
    if (order) {
      setOrderDetails(order);

      // Добавление маршрута на карту
      L.Routing.control({
        waypoints: [
          L.latLng(order.startPoint.latitude, order.startPoint.longitude),
          L.latLng(order.endPoint.latitude, order.endPoint.longitude),
        ],
        createMarker: () => null, // Не показывать маркеры
        routeWhileDragging: true,
        language: "ru",
      }).addTo(mapInstance);
    }
  }, [mapInstance, orderNumber, findOrderByNumber]); // Добавляем findOrderByNumber как зависимость

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Отслеживание заказа {orderNumber}
      </Typography>
      {orderDetails ? (
        <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">Детали заказа</Typography>
          <Typography>Номер заказа: {orderDetails.orderNumber}</Typography>
          <Typography>Клиент: {orderDetails.customerName}</Typography>
          <Typography>Маршрут: {orderDetails.startDock} - {orderDetails.endDock}</Typography>
        </Paper>
      ) : (
        <Typography>Заказ не найден.</Typography>
      )}
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
    </Box>
  );
}

export default TripTracking;
