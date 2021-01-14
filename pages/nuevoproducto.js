import React from 'react';
import Layout from "../components/Layout";
import {gql, useMutation} from "@apollo/client";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Swal from "sweetalert2";
import {useRouter} from "next/router";

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput){
        nuevoProducto(input: $input){
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
        }
    }
`;

const Nuevoproducto = () => {
  const router = useRouter();
  const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
    update(cache, {data: {nuevoProducto}}) {
      const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: [...obtenerProductos, nuevoProducto],
        }
      });
    }
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      precio: 0,
      existencia: 0,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
      existencia: Yup.number().required('La existencia es obligatorio').positive('Solo números positivos').integer('Solo números enteros'),
      precio: Yup.number().required('El precio es obligatorio').positive('Solo números positivos'),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const data = await nuevoProducto({variables: {input: values}});

        await Swal.fire('El producto ha sido registrado', '', 'success');
        await router.push('/productos');
      } catch (error) {
        console.log(error);
      }

    },
  });

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Crear nuevo producto</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
              <input type="text" placeholder="Nombre" id="nombre"
                     value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur}
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
              <label className="block text-gray-700 text-sm font-bold mb-2">Existencia</label>
              <input type="number" placeholder="Existencia" id="existencia"
                     value={formik.values.existencia} onChange={formik.handleChange} onBlur={formik.handleBlur}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
            {formik.touched.existencia && formik.errors.existencia
              ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.existencia}</p>
              </div>
              : null
            }

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
              <input type="number" placeholder="Prcio" id="precio"
                     value={formik.values.precio} onChange={formik.handleChange} onBlur={formik.handleBlur}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
            {formik.touched.precio && formik.errors.precio
              ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.precio}</p>
              </div>
              : null
            }

            <input type="submit"
                   className="bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 uppercase"
                   value="Agregar nuevo producto"/>
          </form>
        </div>
      </div>

    </Layout>
  );
};

export default Nuevoproducto;