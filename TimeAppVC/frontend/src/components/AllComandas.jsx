import UseView from '../hooks/UseView';
import { formatearFecha } from '../helpers/FormatearFechas'
import { UilSearch } from '@iconscout/react-unicons'
import { useState } from 'react';
import { UilEdit } from '@iconscout/react-unicons'
import EditarComanda from '../middleware/EditarComanda';

const AllComandas = () => {
  const { comandas, handleEditarComanda } = UseView();
  const [search, setSearch] = useState("");

  console.log(comandas)

  return (
    <>
      <div className='flex flex-col mt-10'>
        <div className='flex items-center justify-between'>
          <h1 className='p-4 text-3xl font-bold text-slate-700'>Lista de comandas</h1>
          <div className='flex justify-end items-center '>
            <div className='p-3 text-white flex gap-3 items-center bg-slate-800 max-w-fit rounded-xl shadow'>
              <input
                className='focus:outline-none px-4 py-1 rounded-lg shadow-lg font-medium text-slate-500'
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder='Search'
              />
              <UilSearch />
            </div>
          </div>
        </div>
        {comandas.length ?
          comandas.filter(comanda => {
            if (search === '') return comanda;
            else if (comanda.nombre.toLowerCase().includes(search.toLowerCase()) || comanda.productoComanda.slice(3, 300).toLowerCase().includes(search.toLowerCase()) || comanda.creadorNombre.toLowerCase().includes(search.toLowerCase()) || comanda.cuenta.toLowerCase().includes(search.toLowerCase()) || formatearFecha(comanda.fecha).toLowerCase().includes(search.toLowerCase())) {
              return comanda
            }
          }).map(comanda => (
            <div className={comanda.terminado ? 'max-w-screen-lg mx-auto flex justify-between w-full bg-slate-700 text-white rounded-lg my-2 items-center' : 'max-w-screen-lg mx-auto flex justify-between w-full bg-white text-slate-700 rounded-lg my-2 items-center'}>
              <div
                key={comanda._id}
                className=' p-4 flex flex-col'>
                <div className='flex'>
                  <span className='min-w-[150px]'>Comanda: </span>
                  <span>{comanda.nombre}</span>
                </div>
                <div className='flex'>
                  <span className='min-w-[150px]'>Cuenta: </span>
                  <span>{comanda.cuenta}</span>
                </div>
                <div className='flex'>
                  <span className='min-w-[150px]'>Tipo de producto: </span>
                  <span>{comanda.productoComanda.slice(3, 300)}</span>
                </div>
                <div className='flex'>
                  <span className='min-w-[150px]'>Creador: </span>
                  <span>{comanda.creadorNombre}</span>
                </div>
                <div className='flex'>
                  <span className='min-w-[150px]'>Fecha: </span>
                  <span>{formatearFecha(comanda.fecha)}</span>
                </div>
                <div className='flex'>
                  <span className='min-w-[150px]'>Estado: </span>
                  <span>{comanda.terminado ?
                    <span>Finalizado</span>
                    : <span>En progreso</span>}
                  </span>
                </div>
              </div>
              <div className='px-10'>
                <button
                  onClick={() => handleEditarComanda(comanda)}
                  className='bg-sky-600 p-2 rounded shadow text-white'>
                  <UilEdit />
                </button>
              </div>
            </div>

          ))
          : <span>No hay comandas que listar</span>}
      </div>
      <EditarComanda />

    </>
  )
}

export default AllComandas
