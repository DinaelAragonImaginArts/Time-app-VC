import { createContext, useEffect, useState } from 'react';
import cliente from '../config/cliente';
import { useNavigate } from 'react-router-dom'
import UseAuth from '../hooks/UseAuth';

const ViewContext = createContext();
const ViewProvider = ({ children }) => {
    const { autentication } = UseAuth()
    const [comandas, setComandas] = useState([]);
    const [comanda, setComanda] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState([]);
    const [cargando, setCargando] = useState(false)
    const [tarea, setTarea] = useState({})
    const [alerta, setAlerta] = useState({});

    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [modalComanda, setModalComanda] = useState(false)
    const [productoModal, setProductoModal] = useState(false);
    const [editarComandaModal, setEditarComandaModal] = useState(false);
    //Cuentas
    const [cuentas, setCuentas] = useState([])
    const [cuenta, setCuenta] = useState([])
    const [cuentaModal, setCuentaModal] = useState(false)
    //Tipo de Tareas
    const [tiposTarea, setTiposTarea] = useState([])
    const [tipoTarea, setTipoTarea] = useState([])
    const [modalTipoTarea, setModalTipoTarea] = useState(false)


    const navigate = useNavigate();
    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }
    //Obtener todas las comadas
    useEffect(() => {
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
                const { data } = await cliente('/view', config);
                setComandas(data)
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true,
                })
            }
        }
        getComandas()
    }, [autentication])
    //Comandas
    const getComanda = async id => {
        setCargando(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente(`/view/${id}`, config)
            setComanda(data)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            })
            navigate('/view');
        }
        finally {
            setCargando(false);
        }
    }

    const handleComanda = () => {
        setModalComanda(!modalComanda)
    }
    const crearComanda = async comanda => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await cliente.post('/admin', comanda, config);
            setComandas([...comandas, data])
            setAlerta({
                msg: 'Comanda creada correctamente',
                error: false,
            })
            setTimeout(() => {
                setAlerta({});
                setModalComanda(false);
            }, 1000)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }

    const handleEditarComanda = (comanda) => {
        setComanda(comanda)
        setEditarComandaModal(!editarComandaModal)
    }

    const editarComanda = async (comanda) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.put('/admin/editar-comanda', comanda, config)
            setComandas(data);
            setAlerta({
                msg: 'Comanda actualizado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 1000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const terminarComanda = async id => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post(`/admin/${id}`, { id: id }, config);
            const comandaActualizada = comandas.map(comandaState => comandaState._id === data._id ? data : comandaState)
            setComandas(comandaActualizada)
            setAlerta({
                msg: 'Comanda Terminada',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 1000);
        }
        catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }

    //Tareas 
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({});
    }

    const handleEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    }

    const submitTarea = async (tarea) => {
        if (tarea.id) {
            await editarTarea(tarea)
        }
        else {
            await crearTarea(tarea)
        }
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post('/tareas', tarea, config);
            const comandaActualizada = { ...comanda }
            comandaActualizada.tareas = [...comanda.tareas, data]
            setComanda(comandaActualizada);
            setAlerta({
                msg: 'Tarea Creada Correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({});
                setModalFormularioTarea(false);
            }, 1000);
        }
        catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }
    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.put(`/tareas/${tarea.id}`, tarea, config);

            //sincronizando  la tarea al state
            const comandaActualizada = { ...comanda }
            comandaActualizada.tareas = comandaActualizada.tareas.map(tareaState => tareaState._id === data._id
                ? data
                : tareaState)
            setComanda(comandaActualizada);
            setAlerta({
                msg: 'Comanda guardada correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({});
                setModalFormularioTarea(false);
            }, 1000);

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }

    const handleEliminarTarea = tarea => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    }
    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.delete(`/tareas/${tarea._id}`, config);

            const comandaActualizada = { ...comanda };
            comandaActualizada.tareas = comandaActualizada.tareas.filter(tareaState => tareaState._id !== tarea._id)
            setComanda(comandaActualizada);
            setModalEliminarTarea(false);
            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
            }, 1800);

            setTarea({})

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }

    //Colaboradores
    const eliminarColaborador = async (colaborador) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post(`admin/comanda/eliminar-colaboradores/${comanda._id}`, colaborador, config)
            const comandaActualizada = { ...comanda }
            comandaActualizada.colaboradores = comandaActualizada.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id);
            setComanda(comandaActualizada);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }
    const agregarColaborador = async (user) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.put(`admin/comanda/colaboradores/${comanda._id}`, user, config);
            const comandaActualizada = { ...comanda }
            comandaActualizada.colaboradores = comandaActualizada.colaboradores.filter(colaboradorState => colaboradorState._id !== user._id);
            setComanda(comandaActualizada);
            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 1500);

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 1500);
        }
    }

    //Obtener Todos los productos
    useEffect(() => {
        const getProductos = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await cliente('/admin/producto', config);
                setProductos(data);
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
                setTimeout(() => {
                    setAlerta({})
                }, 2500)
            }
        }
        getProductos()
    }, [autentication])
    const handleProductoModal = (producto) => {
        setProducto(producto)
        setProductoModal(!productoModal)
    }
    const saveProduct = (producto) => {
        if (producto.id) {
            editarProducto(producto)
        } else {
            crearProducto(producto)
        }
    }
    const crearProducto = async (producto) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post('/admin/producto', producto, config);
            setProductos([...productos, data])
            setAlerta({
                msg: 'Producto creado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({});
            }, 1000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }
    const editarProducto = async (producto) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.put('/admin/editar-producto', producto, config)
            setProductos(data);
            setAlerta({
                msg: 'Producto actualizado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 1000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }
    const eliminarProducto = async (producto) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post('/admin/eliminar-producto', producto, config);
            const productosActualizados = productos.filter(producto => {
                if (producto._id !== data._id) {
                    return producto
                }
            })
            setProductos(productosActualizados)
            setAlerta({
                msg: 'Producto eliminado correctamente',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 1500)
        }
        catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }

    //Cuentas
    useEffect(() => {
        const getCuentas = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await cliente('/admin/cliente', config)
                setCuentas(data);
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
                setTimeout(() => {
                    setAlerta({})
                }, 2500)
            }

        }
        getCuentas()
    }, [autentication])

    const handleCuentas = (cuenta) => {
        setCuenta(cuenta)
        setCuentaModal(!cuentaModal)
    }
    const submitCuenta = (cuenta) => {
        if (cuenta.id) {
            editarCuenta(cuenta)
        }
        else {
            crearCuenta(cuenta)
        }
    }

    const crearCuenta = async (cuenta) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post('/admin/cliente', cuenta, config);
            setCuentas([...cuentas, data])
            setAlerta({
                msg: 'Cuenta creada correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({});
            }, 1000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }
    const editarCuenta = async (cuenta) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.put('/admin/editar-cuenta', cuenta, config)
            setCuentas(data);
            setAlerta({
                msg: 'Producto actualizado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 1000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }

    const eliminarCuenta = async (cuenta) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post('/admin/eliminar-cuenta', cuenta, config);
            const cuentaActualizada = cuentas.filter(cuenta => {
                if (cuenta._id !== data._id) {
                    return cuenta
                }
            })
            setCuentas(cuentaActualizada)
            setAlerta({
                msg: 'Cuenta Eliminada correctamente',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
        catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }

    //TIPOS DE TAREAS
    useEffect(() => {
        const getTipoTarea = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await cliente('/view/tipo-tarea', config);
                setTiposTarea(data)
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
                setTimeout(() => {
                    setAlerta({})
                }, 2500)
            }
        }
        getTipoTarea()
    }, [autentication])

    const handleTiposTarea = (tipoTarea) => {
        setTipoTarea(tipoTarea)
        setModalTipoTarea(!modalTipoTarea)
    }

    const submitTipoTarea = (tipoTarea) => {
        if (tipoTarea.id) {
            editarTipoTarea(tipoTarea)
        }
        else {
            crearTipoTarea(tipoTarea)
        }
    }

    const crearTipoTarea = async (tipoTarea) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post('/admin/tipo-tarea', tipoTarea, config);
            setTiposTarea([...tiposTarea, data])
            setAlerta({
                msg: 'Cuenta creada correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({});
            }, 1000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }
    const editarTipoTarea = async (cuenta) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.put('/admin/editar-tipo-tarea', cuenta, config)
            setTiposTarea(data)
            setAlerta({
                msg: 'Producto actualizado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 1000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }

    const eliminarTipoTarea = async (tipoTarea) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await cliente.post('/admin/eliminar-tipo-tarea', tipoTarea, config);
            const tipoActualizados = tiposTarea.filter(tipo => {
                if (tipo._id !== data._id) {
                    return tipo
                }
            })
            setTiposTarea(tipoActualizados);
            setAlerta({
                msg: 'Tipo de tarea eliminado correctamente',
                error: true
            })
        }
        catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500)
        }
    }


    return (
        <ViewContext.Provider
            value={{
                comandas,
                getComanda,
                comanda,
                alerta,
                modalFormularioTarea,
                handleModalTarea,
                cargando,
                submitTarea,
                handleEditarTarea,
                tareas,
                setTareas,
                tarea,
                setComanda,
                mostrarAlerta,
                eliminarTarea,
                handleEliminarTarea,
                modalEliminarTarea,
                eliminarColaborador,
                agregarColaborador,
                terminarComanda,
                handleComanda,
                modalComanda,
                crearComanda,
                productos,
                crearProducto,
                eliminarProducto,
                editarProducto,
                productoModal,
                setProductoModal,
                handleProductoModal,
                producto,
                saveProduct,
                //TODO: cuentas
                cuentas,
                cuenta,
                handleCuentas,
                cuentaModal,
                submitCuenta,
                setCuentaModal,
                eliminarCuenta,
                //TODO: Tipos Tarea
                modalTipoTarea,
                setModalTipoTarea,
                tiposTarea,
                tipoTarea,
                handleTiposTarea,
                submitTipoTarea,
                eliminarTipoTarea,
                handleEditarComanda,
                editarComandaModal,
                editarComanda,
                setEditarComandaModal

            }}
        >
            {children}
        </ViewContext.Provider>
    )
}

export {
    ViewProvider
}

export default ViewContext;