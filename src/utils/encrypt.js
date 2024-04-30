import bcrypt from 'bcrypt';

const saltRounds = 10; // Cost factor (how much time needed to hash)

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (e) {
        return { error: e };
    }
};

export const isPasswordMatch = async (password, expectedHash) => {
    try {
        const isMatch = await bcrypt.compare(password, expectedHash);
        return isMatch;
    } catch (e) {
        return false;
    }
};
