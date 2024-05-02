export const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};

export const saveUserToStorage = async (username) => {
    saveToLocalStorage('splash-user', username);
};

export const getUserFromStorage = () => {
    return getFromLocalStorage('splash-user');
};

export const removeUserFromStorage = () => {
    removeFromLocalStorage('splash-user');
};
