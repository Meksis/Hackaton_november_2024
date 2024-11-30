// import React, { useState } from "react";
// import { TextField, Button, Box, Typography } from "@mui/material";

// function OrderForm({ addOrder }) {
//   const [customerName, setCustomerName] = useState("");
//   const [startPoint, setStartPoint] = useState(""); // Начальная точка
//   const [endPoint, setEndPoint] = useState(""); // Конечная точка
//   const [date, setDate] = useState("");
  
//   // Обработчик отправки формы
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (customerName && startPoint && endPoint && date) {
//       const orderNumber = new Date().getTime(); // Уникальный номер заказа (timestamp)

//       const newOrder = {
//         orderNumber, // Добавляем уникальный номер заказа
//         customerName,
//         startPoint,
//         endPoint,
//         date,
//       };

//       // Добавляем новый заказ в список
//       addOrder(newOrder);

//       // Очистка полей после отправки
//       setCustomerName("");
//       setStartPoint("");
//       setEndPoint("");
//       setDate("");
//     } else {
//       alert("Пожалуйста, заполните все поля.");
//     }
//   };

//   return (
//     <Box sx={{ padding: "20px" }}>
//       <Typography variant="h4" gutterBottom>
//         Оформление заказа
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="Имя клиента"
//           variant="outlined"
//           value={customerName}
//           onChange={(e) => setCustomerName(e.target.value)}
//           sx={{ marginBottom: "20px" }}
//         />
//         <TextField
//           fullWidth
//           label="Начальная точка"
//           variant="outlined"
//           value={startPoint}
//           onChange={(e) => setStartPoint(e.target.value)}
//           sx={{ marginBottom: "20px" }}
//         />
//         <TextField
//           fullWidth
//           label="Конечная точка"
//           variant="outlined"
//           value={endPoint}
//           onChange={(e) => setEndPoint(e.target.value)}
//           sx={{ marginBottom: "20px" }}
//         />
//         <TextField
//           fullWidth
//           label="Дата"
//           variant="outlined"
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           sx={{ marginBottom: "20px" }}
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <Button variant="contained" color="primary" type="submit">
//           Оформить заказ
//         </Button>
//       </form>
//     </Box>
//   );
// }

// export default OrderForm;
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function OrderForm({ docks, setOrders }) {
  const [startDockName, setStartDockName] = useState("");
  const [endDockName, setEndDockName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const navigate = useNavigate();

  const findDockByName = (name) => {
    return docks.find((dock) => dock.name.toLowerCase() === name.toLowerCase());
  };

  const handleCreateOrder = () => {
    const startDock = findDockByName(startDockName);
    const endDock = findDockByName(endDockName);

    if (!startDock || !endDock) {
      alert("Некорректные названия точек маршрута.");
      return;
    }

    const newOrder = {
      orderNumber,
      customerName,
      startDock: startDockName,
      endDock: endDockName,
      startPoint: startDock,
      endPoint: endDock,
      date: new Date().toLocaleDateString(),
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    alert("Заказ создан!");
    navigate("/orders-management"); // Переход к управлению заказами
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Оформление заказа
      </Typography>
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <TextField
          label="Имя клиента"
          variant="outlined"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          fullWidth
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          label="Номер заказа"
          variant="outlined"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          fullWidth
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          label="Начальная точка"
          variant="outlined"
          value={startDockName}
          onChange={(e) => setStartDockName(e.target.value)}
          fullWidth
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          label="Конечная точка"
          variant="outlined"
          value={endDockName}
          onChange={(e) => setEndDockName(e.target.value)}
          fullWidth
          sx={{ marginBottom: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "10px" }}
          onClick={handleCreateOrder}
        >
          Оформить заказ
        </Button>
      </Paper>
    </Box>
  );
}

export default OrderForm;
