// import React from "react";
// import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

// function OrdersManagement({ orders }) {
//   return (
//     <Box sx={{ padding: "20px" }}>
//       <Typography variant="h4" gutterBottom>
//         Управление заказами
//       </Typography>

//       <Paper sx={{ padding: "20px", boxShadow: 3 }}>
//         {orders.length > 0 ? (
//           <List>
//             {orders.map((order, index) => (
//               <ListItem key={index}>
//                 <ListItemText
//                   primary={`Номер заказа: ${order.orderNumber} | Клиент: ${order.customerName}`}
//                   secondary={`Начальная точка: ${order.startPoint} | Конечная точка: ${order.endPoint} | Дата: ${order.date}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Typography variant="body1">Нет заказов.</Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// export default OrdersManagement;
import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function OrdersManagement({ orders }) {
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Управление заказами
      </Typography>
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Список заказов
        </Typography>
        {orders.length === 0 ? (
          <Typography>Нет заказов.</Typography>
        ) : (
          orders.map((order) => (
            <Box key={order.orderNumber} sx={{ marginBottom: "10px" }}>
              <Typography>
                Номер заказа: {order.orderNumber}, Клиент: {order.customerName},{" "}
                {order.startDock} - {order.endDock}
              </Typography>
              <Link to={`/tracking/${order.orderNumber}`}>
                <Button variant="contained" color="primary">
                  Отслеживать
                </Button>
              </Link>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}

export default OrdersManagement;

