class UserDTO{
    constructor(user){
        this.email = user.email;
        this.rol= user.rol;
        this.cart = user.cart;
    }
}

export default UserDTO;