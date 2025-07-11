# Управление IT-проектами - Devflow

## О проекте

Этот репозиторий содержит фронтенд часть системы для управления проектами, разработанного на React. Проект связан с [бэкенд репозиторием](https://github.com/ZIRex03/devflow-backend), где реализована серверная часть и API.

**Важно**:
1. Приложение использует локальную базу данных для разработки, поэтому приложение и его функции недоступны вдля просмотра. Функционал описан ниже в пункте скриншоты
2. Проект находится в разработке, финальная версия приложения может отличаться.
3. Проект разработан в рамках выпускной квалификационной работы (ВКР).

## Основные функции

**Основные функции (для всех пользователей)**

* **Дашборд с аналитикой**
* **Список проектов** с поиском и фильтрацией
* **Канбан-доска задач**, разделенная по статусам (в планах/ в работе/ на проверке/ завершенные)
* **Уведомления** (о назначении задач/проектов, исключение из задач/проектов)
* **Профиль пользователя** (смена аватара и обложки)
* **Авторизация**

**Менеджерские функции (для администратора)**

* **Добавление/редактирование проектов**
* **Управление задачами** (создание, назначение участникам, редактирование)
* **Управление участниками** (добавление/удаление из проекта)
* **Генерация отчетов** (выбор проекта и периода -> предпросмотр PDF)
* **Просмотр отчетов** (загрузка PDF с сервера)

## Технологии

* **Frontend:** React, Redux Toolkit, React Router, primereact
* **Графика:** Chart.js
* **Стили:** SCSS
* **PDF-генерация:** jsPDF
* **API:** Axios
* **Сборка:** Vite

## Скриншоты интерфейса

1. **ДАШБОРД**

**Дашборд менеджера:**
![Дашборд админа](./screenshots/dashboard.png)
![Просроченные проекты](./screenshots/dashboard-projects.png)
**Дашборд пользователя:**
![Дашборд пользователя](./screenshots/dashboard-user.png)

3. **ПРОЕКТЫ**
![Список проектов](./screenshots/projects.png)
![Kanban-доска проекта](./screenshots/projects-kanban.png)
![Информация о проекте](./screenshots/projects-info.png)
![Информация о задаче](./screenshots/task-info.png)
**Функции администрирования проекта:**
![Добавление проекта](./screenshots/projects-add.png)
![Редактирование проекта](./screenshots/projects-edit.png)
![Участиники проекта](./screenshots/projects-users.png)
![Добавление участников проекта](./screenshots/projects-users-add.png)
![Добавление задачи](./screenshots/task-add.png)
![Редактирование задачи](./screenshots/task-edit.png)
![Назначение задачи участникам проекта](./screenshots/task-users-add.png)

4. **ОТЧЕТЫ**
![Страница отчетов](./screenshots/reports.png)
![Просмотр отчетов](./screenshots/reports-view.png)
![Генерация отчетов](./screenshots/reports-generate.png)

5. **Уведомления**
![Уведомления](./screenshots/notifications.png)

6. **Авторизация**
![Страница авторизации](./screenshots/login.png)
