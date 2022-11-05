const { ADMIN } = require('../constants/role');
const User = require('../models/user')

const createUser = async (user) => {
    try {
        const newUser = new User(user);
        const token = await newUser.generateAuthToken();
        console.log(token);
        newUser.tokens.push({token});
        await newUser.save();
        return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token
        }
    } catch (error) {
        console.log({error});
    }
}

const login = async (email, password, isLoginAdmin) => {
    try {
        const user = await User.findByCredential(email, password);
        const token = await user.generateAuthToken();
        if (isLoginAdmin === 'true' && user.role !== ADMIN) {
            throw new Error("You cannot login as an admin");
        }
        user.tokens.push({token});
        await user.save();
        return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token
        }
    } catch (error) {
        console.log({error});
    }
}

const logout = async (user, token) => {
    try {
        user.tokens = user.tokens.filter(userToken => userToken === token);
        await user.save();
        return null;
    } catch (error) {
        console.log({error});
    }
}

const getAllUsers = async () => {
    try {
        const users = await User.find({});
        return users;
    } catch (error) {
        console.log({error});
    }
}

module.exports = {
    createUser,
    login,
    logout,
    getAllUsers
}