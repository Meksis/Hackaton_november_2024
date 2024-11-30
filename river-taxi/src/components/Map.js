import React, { useEffect, useRef } from "react";

function Map({ docks }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (window.ymaps) {
      // Инициализация карты
      const map = new window.ymaps.Map(mapContainer.current, {
        center: [55.7558, 37.6176], // Центр карты (Москва)
        zoom: 12,
        controls: ['zoomControl', 'searchControl', 'trafficControl'],
      });

      // Добавление маркеров для каждого причала
      docks.forEach(dock => {
        const placemark = new window.ymaps.Placemark(
          [dock.latitude, dock.longitude],
          {
            balloonContentHeader: dock.name,
            balloonContentBody: `${dock.address}, ${dock.river}`,
          },
          {
            preset: 'islands#icon',
            iconColor: '#0095b6',
          }
        );

        // Добавление маркера на карту
        map.geoObjects.add(placemark);
      });
    }
  }, [docks]); // Зависимость от данных docks, карта обновится при изменении

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '500px' }} // Размер карты
    />
  );
}

export default Map;
