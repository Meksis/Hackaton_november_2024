### Команда: Carbon

### Участники команды:
- Землянский Павел -
- Русаков Илья - 
- Орлов Вадим - Backend-разработчик
- Портнягин Александр - 
- Васильев Даниель - 

### Структура проекта:
В папке backend - express и nodejs файлы для бэка и записи начальных данных в БД
В data - выданные данные
В river-taxi - фронт на React
В Docker - compose-файл для контейнера 

### Как настроить и запустить:
 - В репозитории есть три ветки - main, back и frontend. Релизной считать main.

- При клонировании репозитория необходимо перейти в папки backend и river-taxi и выполнить команду `npm install`.
- Для запуска бэка - перейти в папку backend, выполнить `npm start`
- Для запуска фронта - перейти в папку river-taxi, выполнить `npm start`
- Для запуска БД - либо используйте свои авторизационные данные в файле configs.env, либо можете развернуть контейнер с БД так же основываясь на данных в конфиге.

### Стек:
- backend - NodeJS + Express
- frontend - React
- DB - Postgre (Docker / remote)
