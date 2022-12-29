import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import Header from '../utils/Header'
import UseAuth from '../hooks/UseAuth';
import { useEffect } from 'react';

const AuthLayout = () => {
    const { autentication } = UseAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if(autentication.area !== 'Administracion'){
            navigate('/app/comandas');
        }
    }, [])
    return (
        <>
            {token ? (
                <div className='flex flex-col min-h-screen bg-[#ebf0f5]'>
                    <div>
                        <Header autentication={autentication} />
                    </div>
                    <div>
                        <Outlet />
                    </div>
                </div>
            ) :
                <Navigate to='/' />
            }
        </>
    )
}

export default AuthLayout