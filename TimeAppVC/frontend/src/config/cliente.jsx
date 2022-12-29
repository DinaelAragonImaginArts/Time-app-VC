import axios from 'axios'

const cliente = axios.create({
     //Desarrollo
    //baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`
     //Produccion
    baseURL: 'https://timeappv4.herokuapp.com/api/'
})

export default cliente;