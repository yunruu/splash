export const validatePassword = (password) => {
    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }
    return { data: password };
};
