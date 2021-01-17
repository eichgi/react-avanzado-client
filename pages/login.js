import React, {useState} from 'react';
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
        }
    }
`;

const Login = () => {

  const router = useRouter();
  const [mensaje, guardarMensaje] = useState(null);

  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required('El correo es obligatorio'),
      password: Yup.string().required().min(6, 'La contraseña es obligatoria'),
    }),
    onSubmit: async (values) => {
      console.log(values);

      try {
        const {data} = await autenticarUsuario({variables: {input: values}});

        console.log(data);
        guardarMensaje('Autenticando...');

        const {token} = data.autenticarUsuario;
        setTimeout(() => {
          localStorage.setItem('token', token);
        }, 500);

        setTimeout(() => {
          guardarMensaje(null);
          router.push('/');
        }, 3000);
      } catch (error) {
        console.log(error);
        guardarMensaje(error.message);

        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
    }
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  }

  return (
    <>
      <Layout>
        {mensaje && mostrarMensaje()}

        <h1 className="text-center text-2xl text-white font-light">
          Login
        </h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm ">
            <form action="" className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" placeholder="Email" id="email" value={formik.values.email}
                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
              </div>
              {formik.touched.email && formik.errors.email
                ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.email}</p>
                </div>
                : null
              }

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                <input type="password" placeholder="Contraseña" id="password" value={formik.values.password}
                       onChange={formik.handleChange} onBlur={formik.handleBlur}
                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
              </div>
              {formik.touched.password && formik.errors.password
                ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
                : null
              }

              <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                     value="Iniciar sesión"/>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;