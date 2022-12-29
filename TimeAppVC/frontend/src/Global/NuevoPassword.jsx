import { useState, useEffect } from "react"
import { Link, useParams } from 'react-router-dom';
import cliente from "../config/cliente";
import Alerta from "../utils/Alerta";

const NuevoPassword = () => {
  const [tokenValido, setTokenValido] = useState(false)
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})
  const [passwordModificado, setPasswordModificado] = useState(false)
  const params = useParams();

  const { token } = params;
  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await cliente(`/usuarios/olvide-password/${token}`)
        setTokenValido(true);

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken();
  }, [])
  const handleSubmit = async e => {
    e.preventDefault();
    if (password < 6) {
      setAlerta({
        msg: 'El password debe ser minimo de 6 caracteres',
        error: true
      })
      return
    }
    try {
      const url = `/usuarios/olvide-password/${token}`;

      const { data } = await cliente.post(url, { password })
      setAlerta({
        msg: data.msg,
        error: false
      })

      setPassword('');
      setPasswordModificado(true);

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

  const { msg } = alerta;
  return (
    <>
      <h1 className="text-center my-5 text-slate-100 uppercase text-xl">Reestrablece tu password</h1>
      <div className="">
        <div className="flex flex-col justify-center items-center">
          {msg && <Alerta alerta={alerta} />}
          {tokenValido && (
            <form className='px-1 py-3 min-w-[300px] bg-white gap-3 rounded-lg shadow flex flex-col justify-center items-center ' onSubmit={handleSubmit}>
              <div className='my-5'>
                <label htmlFor="password" className='text-center text-gray-600 block text-xl font-bold'>Nuevo password</label>
                <input
                  id='password'
                  type="password"
                  placeholder='Ingresa tu nuevo password'
                  className='w-full p-3 border rounded-xl bg-gray-50 mt-5'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <input
                type="submit"
                value="Guardar"
                className="bg-green-600 mb-5 py-1.5 px-6 text-white  font-bold rounded-xl hover:cursor-pointer hover:bg-green-800 transition-colors" />
              {passwordModificado && (
                <Link className="block text-center my-5 uppercase text-sm negro"
                  to="/"> Iniciar sesión
                </Link>)}
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default NuevoPassword