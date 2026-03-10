# Тестовое задание
Сервис для автоматической синхронизации тарифов на коробы Wildberries. 
Регулярно получает данные через Wildberries API, сохраняет их в PostgreSQL 
и обновляет указанные Google таблицы по расписанию.

**Стек:** Node.js, TypeScript, PostgreSQL, Knex, Google Sheets API, Docker
## Требования к запуску
- Docker & Docker Compose
- Google Cloud аккаунт
- API ключ Wildberries
## Конфигурация Google таблиц
Перед сборкой необходима конфигурация Google API. 
### Создание сервисного аккаунта и получение ключа
1. Зайдите на https://console.cloud.google.com/
2. Нажмите Select a project
3. Нажмите New Project и введите имя проекта
4. Нажмите Create
5. В левой панели выберите APIs & Services
6. Нажмите Enable APIs and services
7. В поиске введите Google Sheets API
8. Нажмите на него и затем нажмите Enable
9. Не выходя из меню APIs & Services нажмите Credentials в левой панели
10. Пролистайте вниз и нажмите Manage service accounts
11. Нажмите Create service account и заполните необходимые поля, затем нажмитет Create and continue
12. В Permissions нажмите на Select a role и во вкладке Basic выберите Owner, затем нажмите Continue и Done
13. В меню управления сервисными аккаунтами во вкладке Actions нажмите на три круга и выберите Manage keys
14. Нажмите Add key и выберите JSON, нажмите Create
15. В скачанном файле скопируйте значение client_email и вставьте его в поле GOOGLE_SERVICE_ACCOUNT_EMAIL в .env файле
16. Также скопируйте значение private_key и вставьте его в поле GOOGLE_PRIVATE_KEY
### Создание таблиц
1. Создайте google таблицу либо перейдите на имеющуюся таблицу, нажмите на Share в правом верхнем углу
2. В поле Add people введите email из поля client_email в скачанном файле, нажмите Send
3. Затем скопируйте ID таблицы (часть url после /d/ и до /edit)
4. Откройте файл src/config/app.config.ts
5. Вставьте id таблицы в массив sheetIds
6. Таким образом вы можете вставлять произвольное количество таблиц, перечисляя их ID через запятую в этом массиве

## Конфигурация .env переменных
Создайте .env файл и заполните его в соответствии с шаблоном .env.example. Для работы приложения требуется API ключ Wildberries. 

```env
NODE_ENV=DEV # Среда (DEV или PROD)
POSTGRES_HOST=db # Название хоста БД (по умолчанию db, так как так называется сервис в докере)
POSTGRES_USER=postgres # Имя пользователя БД
POSTGRES_PASSWORD=postgres # Пароль БД
POSTGRES_PORT=5432 # Порт БД
POSTGRES_DB=testdb # Название БД

WB_API_KEY=enterapikey # Апи ключ wildberries

GOOGLE_SERVICE_ACCOUNT_EMAIL=example@example.iam.gserviceaccount.com # Email сервисного аккаунта гугл (см. Конфигурация Google таблиц)
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----... #  Приватный ключ (см. Конфигурация Google таблиц)
```

> [!NOTE]
> Убедитесь что `.env` файл добавлен в `.gitignore` и не попадает в репозиторий.

## Общая конфигурация приложения
Общая конфигурация приложения находится в src/config/app.config.ts

| Поле          | Тип      | Описание                                                          |
|------------------|----------|-------------------------------------------------------------------|
| `intervalMin`   | `number` | Промежуток времени между обновлениями (в минутах)                  | 
| `parallelChunkSizeLimit` | `number` | Количество одновременных обновлений таблиц (не рекомендуется ставить большое число, так как это может привести к Too Many Requests)           |
| `sheetIds`        | `string[]` | ID таблиц, в которые записывать обновления |
| `tabName`   | `string`   | Название листа в который записывать обновление   |
| `defaultSheetHeaders` | `Record<string, string>` | Заголовки столбцов в таблице |
## Сборка
Перед сборкой необходимо заполнить `.env` файл и конфигурацию.

### Запуск
```bash
docker compose up --build
```

### Запуск в фоновом режиме
```bash
docker compose up --build -d
```

### Остановка
```bash
docker compose down
```

### Просмотр логов
```bash
docker compose logs -f
```