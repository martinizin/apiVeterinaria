
//Importar JWT y el modelo
import jwt from 'jsonwebtoken'
import Veterinario from '../models/veterinario.js'

//MÉTODO PARA PROTEGER RUTAS
const verificarAutenticacion = async (req,res,next)=>{

    //VALIDACIÓN DE ENVÍO DEL TOKEN
if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    
   //DESECTRUCTURACIÓN DEL TOKEN 
const {authorization} = req.headers
//CAPTURA DE ERRORES
    try {
        //VERIFICACIÓN DEL TOKEN CAPTURADO CON EL QUE SE ALMACENA EN LA BDD
        const {id,rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
        //VERIFIACIÓN DEL ROL
        if (rol==="veterinario"){
            //OBTENER EL USUARIO
            req.veterinarioBDD = await Veterinario.findById(id).lean().select("-password")
            //CONTINÚO EL PROCESO
            next()
        }
    } catch (error) {
        //PRESENTACIÓN DE ERRORES
        const e = new Error("Formato del token no válido")
        return res.status(404).json({msg:e.message})
    }
}

export default verificarAutenticacion