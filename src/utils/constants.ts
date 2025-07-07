
export const BASE_URL = 'http://localhost:5000';

export const translatePriority = new Map([
    ['Высокий', 'high'],
    ['Средний', 'medium'],
    ['Низкий', 'low']
]);

export const translateStatus = new Map([
    ['todo', 'В планах'],
    ['progress', 'В работе'],
    ['review', 'На проверке'],
    ['completed', 'Завершено'],
]);

export const translateStatusProject = new Map([
    ['active', 'В работе'],
    ['hold', 'На паузе'],
    ['done', 'Готово'],
]);

export const monthName = new Map([
    [1, 'Янв'],
    [2, 'Фев'],
    [3, 'Март'],
    [4, 'Апр'],
    [5, 'Май'],
    [6, 'Июнь'],
    [7, 'Июль'],
    [8, 'Авг'],
    [9, 'Сен'],
    [10, 'Окт'],
    [11, 'Ноя'],
    [12, 'Дек'],
]);

const allowedRoles = ['Manager', 'Admin'];

export const checkUserRole = (role: string): boolean => {
    if(!role) return false;
    return allowedRoles.includes(role);
};