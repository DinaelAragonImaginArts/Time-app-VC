import UseAuth from '../hooks/UseAuth';
import UseView from '../hooks/UseView';
import { formatSort, formatearFecha } from '../helpers/FormatearFechas';
import { UilSearch } from '@iconscout/react-unicons'
//components
import ComandaList from './ComadaList';
import Loader from '../utils/Loader';
import { useState } from 'react';

const Comandas = () => {
  const { autentication } = UseAuth();
  const { comandas } = UseView();
  const [search, setSearch] = useState('')
  const comanda = comandas?.map(comanda => {
    return {
      id: comanda._id,
      nombre: comanda.nombre,
      creador: comanda.creadorNombre,
      cuenta: comanda.cuenta,
      fecha: comanda.fecha,
      fechaSort: formatSort(comanda.fecha),
      descripcion: comanda.productoComanda,
      estado: comanda.terminado,
      comentario: comanda.comentario,
    }
  })

  function sortear(a, b) {
    return a.fechaSort.valueOf() - b.fechaSort.valueOf();
  }
  const comandaSort = comanda.sort(sortear);


  return (
    <>
      <div className='mt-2 flex flex-col lg:flex-row md:flex-row lg:justify-between md:justify-between  justify-center px-6'>
        <div className='mt-2 flex items-center gap-2 px-5 bg-slate-800 rounded-full text-white max-w-min py-2 whitespace-nowrap font-black'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className=''>{autentication.nombre}</span>
          <span className='w-[11px] h-[11px] bg-green-400 rounded-full ml-5'></span>
        </div>
        <div className='p-3 text-white flex gap-3 items-center bg-slate-800 max-w-fit rounded-xl shadow'>
          <input
            className='focus:outline-none px-4 py-1 rounded-lg shadow-lg font-medium text-slate-500'
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder='Search'
          />
          <UilSearch />
        </div>
      </div>

      <div className='mt-2 p-4'>
        {comandaSort.length ?
          comandaSort.filter(comanda => {
            if (search === '') return comanda;
            else if (comanda?.nombre?.toLowerCase().includes(search?.toLowerCase())|| comanda?.creador?.toLowerCase().includes(search?.toLowerCase())|| comanda?.cuenta?.toLowerCase().includes(search?.toLowerCase()) || comanda?.descripcion.slice(3, 300)?.toLowerCase().includes(search?.toLowerCase()) || formatearFecha(comanda.fecha)?.toLowerCase().includes(search?.toLowerCase())  || comanda?.comentario?.toLowerCase().includes(search?.toLocaleLowerCase()) ) {
              return comanda
            }
          }).map(comanda => (
            <ComandaList key={comanda.id} comanda={comanda} />
          ))
          : <span> No hay comandas listas, favor de comunicarse con su jefe inmediato</span>}
      </div>
    </>
  )
}


export default Comandas
