import { useMemo, useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { authService } from "../../services/auth.service";

const registerSchema = z.object({
  fullName: z.string().min(3, "Ingresa el nombre completo."),
  email: z.string().email("Ingresa un correo valido."),
  password: z
    .string()
    .min(8, "La contrasena debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "La contrasena debe incluir una mayuscula.")
    .regex(/[a-z]/, "La contrasena debe incluir una minuscula.")
    .regex(/[0-9]/, "La contrasena debe incluir un numero.")
    .regex(/[^A-Za-z0-9]/, "La contrasena debe incluir un caracter especial.")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const generateCustomerId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const customerId = useMemo(() => generateCustomerId(), []);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setErrorMessage(null);
      await authService.register({
        ...values,
        customerId
      });
      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess: `Registro completado para ${values.email}. Ahora puedes iniciar sesion.`
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.detail ?? "No fue posible completar el registro.");
        return;
      }

      setErrorMessage("No fue posible completar el registro.");
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
              <div className="mb-6 flex justify-center lg:hidden">
                <div className="flex h-20 w-20 items-center justify-center bg-[#f7931a] shadow-sm sm:h-24 sm:w-24">
                  <img alt="NovoBanco" className="h-10 w-10 object-contain sm:h-12 sm:w-12" src="/novobank-mark.svg" />
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-600 sm:text-4xl">
                NovoBanco<span className="text-accent">.</span>
              </h1>
              <p className="mt-3 text-sm text-text-muted">Crea tu acceso seguro para gestion bancaria empresarial</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
              <Input label="Nombre completo" placeholder="Juan Perez" error={errors.fullName?.message} {...register("fullName")} />
              <Input label="Correo electronico" placeholder="juan.perez@novobanco.com" error={errors.email?.message} {...register("email")} />
              <label className="flex flex-col gap-1" htmlFor="register-password">
                <span className="text-sm font-medium text-text-main">Contraseña</span>
                <div className="relative">
                  <input
                    autoComplete="off"
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 pr-11 text-text-main placeholder:text-text-muted shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                    id="register-password"
                    placeholder="Password123!"
                    type={isPasswordVisible ? "text" : "password"}
                    {...register("password")}
                  />
                  <button
                    aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-accent transition-colors hover:text-accentHover focus:outline-none"
                    type="button"
                    onClick={() => setIsPasswordVisible((current) => !current)}
                  >
                    {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password?.message ? <span className="mt-1 text-sm text-danger">{errors.password.message}</span> : null}
              </label>
              <Button className="w-full" type="submit" variant="accent" isLoading={isSubmitting}>
                Registrarme
              </Button>
            </form>

            <div className="mt-4 text-right">
              <Link className="text-sm font-semibold text-accent underline underline-offset-2" to="/login">
                Volver al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
