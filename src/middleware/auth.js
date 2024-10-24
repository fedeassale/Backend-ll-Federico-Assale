export function soloAdmin(req,res,next){
    if(req.user.rol === "admin"){
        next();
    } 
    else{
        res.status(403).send("Acceso denegado, solo para admin")
    }
}

export function soloUser(req,res,next){
    console.log("Usuario autenticado:", req.user);
    if(req.user.rol === "user"){
        next();
        }
        else{
            console.log("Rol incorrecto:", req.user.rol);
            res.status(403).send("Acceso denegado, solo para usuarios")
            }
}