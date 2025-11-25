import React from "react";
import AuthForm from "../components/AuthForm";
import AuthInput from "../components/AuthInput";
import Checkbox from "../components/Checkbox";
import SubmitBtn from "../components/SubmitBtn";
import AltLink from "../components/AltLink";
import useRegister from "../hooks/useRegister";
import registerImage from "@/assets/register-image.png";

const RegisterPage = () => {
  const { form, handleChange, handleSubmit, isLoading, fieldErrors } = useRegister(); // Obtener fieldErrors
  const showUniversityField = form.email.includes("@ucol.mx");

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between h-full w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
      <div className="flex flex-col items-start gap-6 sm:gap-8 lg:gap-10 w-full lg:w-6/12 mt-6 sm:mt-8 lg:mt-10">
        {/* Título */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Únete a{" "}
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-lime-600">ReUC</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mt-2">
            Regístrate para empezar a guardar y explorar contenido
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

          {showUniversityField && (
            <AuthInput
              label="Número de cuenta (8 alumnos / 4 maestros)"
              name="universityId"
              type="text"
              value={form.universityId}
              onChange={handleChange}
              error={fieldErrors.universityId}
              placeholder="12345678"
            />
          )}

          <AuthInput
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            placeholder="••••••••"
          />

          <AuthInput
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
            placeholder="••••••••"
          />

          <div className="mt-4">
            <Checkbox
              name="acceptTerms"
              checked={form.acceptTerms}
              onChange={handleChange}
            />
          </div>

          <SubmitBtn text="Registrarse" isLoading={isLoading} />

          <hr className="my-3 border-lime-600" />

          <AltLink
            href="/login"
            text="¿Ya tienes una cuenta?"
            link="Inicia sesión"
          />
        </AuthForm>
      </div>

      <div className="hidden lg:flex items-start justify-start w-full lg:w-7/12">
        <img
          className="rounded-3xl w-full lg:w-10/12"
          src={registerImage}
          alt="Registro"
        />
      </div>
    </section>
  );
};

export default RegisterPage;