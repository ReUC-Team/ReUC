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
    <section className='flex flex-col lg:flex-row items-center justify-between h-full w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-0'>
      <div className="flex flex-col items-start justify-start gap-6 sm:gap-8 lg:gap-10 w-full lg:w-6/12 h-full mt-6 sm:mt-8 lg:mt-10">
        <div className="flex flex-col gap-3 sm:gap-4 justify-between w-full sm:w-10/12 md:w-8/12 text-start">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Bienvenido a <span className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-lime-600'>ReUC</span>
          </h2>
          <p className="text-gray-800 font-semibold text-lg sm:text-xl lg:text-2xl w-full sm:w-10/12 md:w-8/12">
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

        <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-5'>
          <div className='flex flex-col items-center'>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-lime-600">ReUC APP</h3>
            <p className='text-lg sm:text-xl lg:text-2xl font-bold mb-5 sm:mb-7'>Disponible en:</p>
            <div className='flex flex-col items-center gap-2 sm:gap-3'>
              <img src={appStoreImage} alt="App Store" className="w-32 sm:w-auto" />
              <img src={googlePlayImage} alt="Google Play" className="w-32 sm:w-auto" />
            </div>
          </div>
          <img src={reucAppImage} alt="ReUC App" className="hidden sm:block w-32 md:w-auto" />
        </div>
      </div>

      <div className='hidden lg:flex items-start justify-start w-full lg:w-7/12'>
        <img className='rounded-3xl w-full lg:w-10/12' src={loginImage} alt="Login" />
      </div>
    </section>
  );
};

export default LoginPage;