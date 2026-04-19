import { useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "./AuthContext";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo valido."),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres.")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setErrorMessage(null);
      await login(values);
      const next = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";
      navigate(next, { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.detail ?? "No fue posible iniciar sesion.");
        return;
      }

      setErrorMessage("No fue posible iniciar sesion.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="hidden justify-center lg:flex">
            <div className="flex h-[410px] w-[410px] items-center justify-center bg-[#f7931a] shadow-sm">
              <img alt="NovoBanco" className="h-[310px] w-[310px] object-contain" src="/novobank-mark.svg" />
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center sm:mb-10">
              <h1 className="text-3xl font-black tracking-tight text-slate-600 sm:text-4xl">
                NovoBanco<span className="text-accent">.</span>
              </h1>
              <p className="mt-3 text-sm text-text-muted">Acceso seguro para gestion bancaria empresarial</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
              <Input label="Correo electronico" placeholder="juan.perez@novobanco.com" error={errors.email?.message} {...register("email")} />
              <Input
                autoComplete="off"
                label="Contrasena"
                placeholder="********"
                type="password"
                error={errors.password?.message}
                {...register("password")}
              />
              <Button className="w-full" type="submit" variant="accent" isLoading={isSubmitting}>
                Ingresar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
