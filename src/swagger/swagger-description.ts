export const swaggerDescription = `
# 📚 Документация по REST API

## 📋 Основные фичи:

### 🗂 Проект:
- **Создание**: Создание нового проекта.
- **Удаление (Архивация)**: Архивация проекта.
- **Добавление пользователя**: Добавление пользователя в проект.
- **Удаление пользователя**: Удаление пользователя из проекта.
- **Редактирование**: Изменение названия или описания проекта.

### 📝 Задача:
- **Создание**: Добавление новой задачи в проект.
- **Удаление (Архивация)**: Удаление или архивирование задачи.
- **Отметить выполненной/невыполненной**: Обновление статуса задачи.
- **Добавить дедлайн**: Установка срока выполнения задачи.
- **Перемещение**: Перемещение задачи на другую доску.
- **Назначение ответственного**: Назначение пользователя ответственным за задачу.

### 🛠 Роли:
- **Создание**: Создание новых ролей для пользователей (Доступно только администраторам).
- **Получение всех ролей**: Получение всех существующих ролей для пользователей (Доступно только администраторам).

### 👤 Пользователь:
- **Регистрация**: Регистрация нового пользователя. Роль администратора назначается автоматически.
- **Авторизация**: Авторизация пользователя в системе.
- **Добавление роли**: Добавление ролей пользователю.
- **Удаление (Архивация)**: Архивация пользователя.

### 🔐 Роли пользователей:

- **Администратор** (Создается автоматически при первом запуске проекта, если она еще не была создана. Выдается по умолчанию при регистрации):
  - Создание, редактирование и удаление доски.
  - Создание, редактирование и удаление задач.
  - Назначение ответственного за задачу.
  - Добавление пользователя на доску.
  - Создание новых ролей для пользователей.

- **Сотрудник**:
  - Создание, удаление, обновление и выполнение задач, за которые он ответственен.

## 🛡 Гварды безопасности:

### 🔑 **AuthGuard**:
- **Описание**: Гвард для проверки авторизации пользователя.
- **Роль**: Защищает эндпоинты, требующие авторизации, проверяя наличие и корректность **refreshToken** в заголовке **Cookie**.
- **Ошибка**:
  - **401 Unauthorized**: Если токен отсутствует или имеет неверный формат, или если не указан заголовок Cookie.
  - **401 Unauthorized**: Если пользователь не авторизован.
  - **Примечание**: В случае успешной верификации токена, данные пользователя сохраняются в запросе.

### 🔑 **RolesGuard**:
- **Описание**: Гвард для проверки ролей и авторизацию пользователя. Проверяет, имеет ли пользователь соответствующие права для доступа к эндпоинту.
- **Роль**: Используется для защиты эндпоинтов, требующих определенных ролей пользователя.
- **Ошибки**:
  - **400 Bad Request**: Если отсутствует заголовок Cookie.
  - **401 Unauthorized**: Если токен отсутствует или имеет неверный формат.
  - **403 Forbidden**: Если у пользователя нет доступа на основе ролей.
- **Примечание**: Проверяет роль пользователя и сравнивает с необходимыми ролями, указанными в декораторе **@Roles()**. Если роль пользователя не совпадает с требуемой, генерируется ошибка доступа.

### ⚙️ Как работают гварды:
- Гварды **AuthGuard** и **RolesGuard** используются для защиты эндпоинтов. **AuthGuard** проверяет, авторизован ли пользователь, а **RolesGuard** проверяет его роль и доступ к конкретному ресурсу.
- **AuthGuard** гарантирует, что только авторизованные пользователи могут получить доступ к защищенным эндпоинтам.
- **RolesGuard** дополнительно защищает эндпоинты, позволяя доступ только тем пользователям, которые имеют соответствующие роли.

## 🚀 Как использовать:

Используйте **Swagger UI** для тестирования API с реальными данными. Swagger UI позволяет легко взаимодействовать с API и проверять функциональность каждого эндпоинта.
`;
