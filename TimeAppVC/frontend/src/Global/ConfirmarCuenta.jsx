import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import Alerta from "../utils/Alerta";
import cliente from "../config/cliente";


const ConfirmarCuenta = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate()
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `usuarios/confirmar/${id}`
        const { data } = await cliente(url)
        navigate('/')
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    confirmarCuenta();
  }, [])

  const { msg } = alerta;
  return (
    <>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white min-w-[300px] flex flex-col justify-center items-center">
        {msg && <Alerta alerta={alerta} />}
      </div>
    </>
  )
}

export default ConfirmarCuenta