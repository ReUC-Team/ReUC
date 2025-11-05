import React from 'react';
import AuthForm from '../components/AuthForm';
import AuthInput from '../components/AuthInput';
import SubmitBtn from '../components/SubmitBtn';
import AltLink from '../components/AltLink';
import useLogin from '../hooks/useLogin';
import loginImage from '@/assets/login-image.png';
import reucAppImage from '@/assets/reuc-app.png';
import appStoreImage from '@/assets/app-store.png';
import googlePlayImage from '@/assets/play-store.png';

const LoginPage = () => {
  const { form, isLoading, fieldErrors, handleChange, handleSubmit } = useLogin();

  return (
    <section className='flex items-center justify-between h-full w-full ml-20'>
      <div className="flex flex-col items-start justify-start gap-10 w-6/12 h-full mt-10">
        <div className="flex flex-col gap-4 justify-between w-8/12 text-start">
          <h2 className="text-5xl font-bold">
            Bienvenido a <span className='text-5xl font-extrabold text-lime-600'>ReUC</span>
          </h2>
          <p className="text-gray-800 font-semibold text-2xl w-8/12">
            Accede a tu cuenta para continuar explorando el repositorio
          </p>
        </div>

        <AuthForm onSubmit={handleSubmit}>
          <AuthInput 
            label="Correo electrónico" 
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleChange}
            error={fieldErrors.email}
            placeholder="ejemplo@ucol.mx"
          />
          
          <AuthInput 
            label="Contraseña" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange}
            error={fieldErrors.password}
            placeholder="••••••••"
          />

          <AltLink 
            href="/register" 
            text='¿No tienes una cuenta?' 
            link='Regístrate' 
          />

          <SubmitBtn text='Iniciar sesión' isLoading={isLoading} />

          <hr className='text-lime-600 my-3' />
        </AuthForm>

        <div className='flex items-center gap-5'>
          <div className='flex flex-col items-center'>
            <h3 className="text-4xl font-extrabold text-lime-600">ReUC APP</h3>
            <p className='text-2xl font-bold mb-7'>Disponible en:</p>
            <div className='flex flex-col items-center gap-3'>
              <img src={appStoreImage} alt="App Store" />
              <img src={googlePlayImage} alt="Google Play" />
            </div>
          </div>
          <img src={reucAppImage} alt="ReUC App" />
        </div>
      </div>

      <div className='flex items-start justify-start w-7/12'>
        <img className='rounded-3xl w-10/12' src={loginImage} alt="Login" />
      </div>
    </section>
  );
};

export default LoginPage;