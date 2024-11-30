import React, { useState, useEffect, useCallback, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Для создания кастомных тем

// Устанавливаем тему для приложения
const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  palette: {
    primary: {
      main: '#1976d2', // Синий
    },
  },
});

function Home() {
  const [docks, setDocks] = useState([]); // Состояние для хранения данных о причалах
  const [selectedStart, setSelectedStart] = useState(null); // Начальная точка маршрута
  const [selectedEnd, setSelectedEnd] = useState(null); // Конечная точка маршрута
  const [startDockName, setStartDockName] = useState(""); // Название начальной точки для ввода
  const [endDockName, setEndDockName] = useState(""); // Название конечной точки для ввода
  const mapRef = useRef(null); // Ссылка на контейнер карты
  const mapInstance = useRef(null); // Ссылка на экземпляр карты
  const routeControl = useRef(null); // Ссылка на маршрут

  const handleDockClick = useCallback((dock) => {
    if (!selectedStart) {
      setSelectedStart(dock);
      setStartDockName(dock.name);
    } else if (!selectedEnd) {
      setSelectedEnd(dock);
      setEndDockName(dock.name);
    }
  }, [selectedStart, selectedEnd]);

  useEffect(() => {
    // Загружаем данные о причалах (временно используем статические данные)
    const docksData = [
      { id: 31, name: "Парк Горького", latitude: 55.73013, longitude: 37.597184 },
      { id: 32, name: "Нескучный сад", latitude: 55.722427, longitude: 37.590694 },
      { id: 33, name: "Крымский мост", latitude: 55.732427, longitude: 37.596061 },
      { id: 39, name: "Марьино", latitude: 55.641785, longitude: 37.725065 },
    ];

    setDocks(docksData);
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current, {
        center: [55.73013, 37.597184],
        zoom: 12,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(map);

      mapInstance.current = map;
    }

    if (mapInstance.current) {
      docks.forEach((dock) => {
        const marker = L.marker([dock.latitude, dock.longitude])
          .addTo(mapInstance.current)
          .bindPopup(`<b>${dock.name}</b><br>${dock.latitude}, ${dock.longitude}`);

        marker.on("click", () => handleDockClick(dock));
      });
    }
  }, [docks, handleDockClick]);

  useEffect(() => {
    if (selectedStart && selectedEnd) {
      if (routeControl.current) {
        mapInstance.current.removeControl(routeControl.current);
      }

      routeControl.current = L.Routing.control({
        waypoints: [
          L.latLng(selectedStart.latitude, selectedStart.longitude),
          L.latLng(selectedEnd.latitude, selectedEnd.longitude),
        ],
        createMarker: () => null,
        routeWhileDragging: true,
        language: 'ru',  // Локализация на русский язык
      }).addTo(mapInstance.current);

      setSelectedStart(null);
      setSelectedEnd(null);
    }
  }, [selectedStart, selectedEnd]);

  const findDockByName = (name) => {
    return docks.find((dock) => dock.name.toLowerCase() === name.toLowerCase());
  };

  const handleManualRoute = () => {
    const startDock = findDockByName(startDockName);
    const endDock = findDockByName(endDockName);

    if (startDock && endDock) {
      setSelectedStart(startDock);
      setSelectedEnd(endDock);
    } else {
      alert("Некорректные названия точек маршрута.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        {/* Левая панель с формой */}
        <Paper sx={{ width: "30%", padding: "20px", height: "auto", boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Выберите точки маршрута
          </Typography>
          <TextField
            fullWidth
            label="Начальная точка"
            variant="outlined"
            value={startDockName}
            onChange={(e) => setStartDockName(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Конечная точка"
            variant="outlined"
            value={endDockName}
            onChange={(e) => setEndDockName(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleManualRoute}
          >
            Построить маршрут
          </Button>
        </Paper>

        {/* Карта */}
        <Box ref={mapRef} sx={{ width: "65%", height: "500px", boxShadow: 3 }}></Box>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
