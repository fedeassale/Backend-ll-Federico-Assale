import userDao from "../dao/user.dao.js";

class UserRepository{
    async createUser(userData){
        return await userDao.save(userData);

    }

    async getUserById(id){
        return await userDao.findById(id);
    }

    async getUserByEmail(email){
        console.log('Buscando usuario con email:', email);
        return await userDao.findOne({email});
    }

    //pueden crear los metodos para actualizar y eliminar
}

export default new UserRepository();