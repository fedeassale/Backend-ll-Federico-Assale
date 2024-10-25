import userRepository from "../repositories/user.repository.js";
import {createHash,isValidPassword} from "../utils/util.js";
import {cartService} from "./index.js";

class UserServices{
    async registerUser(userData){
        const existingUser = await userRepository.getUserByEmail(userData.email);
        if(existingUser) throw new Error("El usuario ya existe");

        userData.password = createHash(userData.password);
        
        const newCart = await cartService.createCart(); 

        userData.cart = newCart._id;
        return await userRepository.createUser(userData);
    }

    async loginUser(email, password) {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            console.log('Usuario no encontrado');
            throw new Error("Credenciales incorrectas");
        }
        
        
        console.log('Contraseña ingresada:', password);
        console.log('Contraseña almacenada:', user.password);
        
        if (!isValidPassword(password, user)) {
            console.log('Contraseña no válida');
            throw new Error("Credenciales incorrectas");
        }
    
        return user;
    }

    async getUserById(id){
        return await userRepository.getUserById(id);
    }
    
}
export default new UserServices();