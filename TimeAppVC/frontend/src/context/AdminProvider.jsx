import { createContext, useEffect, useState } from 'react';
import cliente from '../config/cliente';
import UseAuth from '../hooks/UseAuth';
const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [comandas, setComandas] = useState([])
    const { autentication } = UseAuth();
    //Modals
    useEffect(() => {
        const getUsersList = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await cliente('/admin/usuarios', config)
                setUsuarios(data)
            } catch (error) {
                console.log(error);
            }
        }
        getUsersList()

        const getTareas = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await cliente('/admin/tareas', config)
                setTareas(data)
            } catch (error) {
                console.log(error);
            }
        }
        getTareas();

        const getComandas = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await cliente('/admin/obtenerComandas', config)
                setComandas(data)
            } catch (error) {
                console.log(error);
            }
        }
        getComandas()
    }, [autentication, comandas])
    return (
        <AdminContext.Provider
            value={{
                usuarios,
                tareas,
                comandas
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

export {
    AdminProvider
}

export default AdminContext;