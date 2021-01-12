import React, {useState} from 'react';
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {gql, useMutation} from '@apollo/client';
import {useRouter} from "next/router";

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
    query obtenerClientesVendedor{
        obtenerClientesVendedor{
            id
            nombre
            apellido
            empresa
            email
        }
    }
`;

const Nuevocliente = () => {

  const router = useRouter();

  const [mensaje, guardarMensaje] = useState(null);

  const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
      update(cache, {data: {nuevoCliente}}) {
        // Obtener el objeto de cache a actualizar
        const {obtenerClientesVendedor} = cache.readQuery({query: OBTENER_CLIENTES_USUARIO});

        //Reescribimos el cache (nunca se modifica, solo se reescribe)
        cache.writeQuery({
          query: OBTENER_CLIENTES_USUARIO,
          data: {
            obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente],
          },
        });
      }
    }
  );

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      empresa: '',
      email: '',
      telefono: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
      apellido: Yup.string().required('El apellido es obligatorio'),
      empresa: Yup.string().required('La empresa es obligatoria'),
      email: Yup.string().email().required('El email es obligatorio'),
      //telefono: Yup.string().required('El nombre es obligatorio'),
    }),
    onSubmit: async (values) => {
      console.log(values);

      try {
        const {data} = await nuevoCliente({
          variables: {
            input: values,
          }
        });

        console.log(data.nuevoCliente);
        router.push('/');
      } catch (error) {
        console.log(error);
        guardarMensaje(error.message);
        setTimeout(() => {
          guardarMensaje(null);
        }, 2000);

      }
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto border-gray-500">
        <p>{mensaje}</p>
      </div>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>

      {mensaje && mostrarMensaje()}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
              <input type="text" placeholder="Nombre" id="nombre" value={formik.values.nombre}
                     onChange={formik.handleChange} onBlur={formik.handleBlur}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
            {formik.touched.nombre && formik.errors.nombre
              ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
              : null
            }

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
              <input type="text" placeholder="Apellido" id="apellido" value={formik.values.apellido}
                     onChange={formik.handleChange} onBlur={formik.handleBlur}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
            {formik.touched.apellido && formik.errors.apellido
              ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.apellido}</p>
              </div>
              : null
            }

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Empresa</label>
              <input type="text" placeholder="Empresa" id="empresa" value={formik.values.empresa}
                     onChange={formik.handleChange} onBlur={formik.handleBlur}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
            {formik.touched.empresa && formik.errors.empresa
              ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.empresa}</p>
              </div>
              : null
            }

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
              <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
              <input type="tel" placeholder="Telefono" id="telefono" value={formik.values.telefono}
                     onChange={formik.handleChange} onBlur={formik.handleBlur}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>

            <input type="submit"
                   className="bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 uppercase"
                   value="Guardar cliente"/>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Nuevocliente;