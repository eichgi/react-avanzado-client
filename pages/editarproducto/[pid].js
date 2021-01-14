import React from 'react';
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {Formik} from "formik";
import {useQuery, useMutation, gql} from "@apollo/client";
import * as Yup from 'yup';
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            nombre
            existencia
            precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input){
            id
            nombre
            existencia
            precio
        }
    }
`;

const EditarProducto = () => {
  const router = useRouter();
  const {query: {id}} = router;


  const {data, loading, error} = useQuery(OBTENER_PRODUCTO, {variables: {id}});
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
    update(cache, {data: {actualizarProducto}}) {
      cache.writeQuery({
        query: OBTENER_PRODUCTO,
        variables: {id},
        data: {
          obtenerProducto: actualizarProducto,
        },
      })
    }
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return 'Accíon no permitida';
  }

  const {obtenerProducto} = data;
  const {nombre, existencia, precio} = obtenerProducto;

  const initialValues = {
    nombre,
    existencia,
    precio,
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required('El nombre es obligatorio'),
    existencia: Yup.number().required('La existencia es obligatorio').positive('Solo números positivos').integer('Solo números enteros'),
    precio: Yup.number().required('El precio es obligatorio').positive('Solo números positivos'),
  });

  const actualizarInfoProducto = async (values) => {
    console.log(values);

    try {
      const {data} = await actualizarProducto({
        variables: {
          input: values,
          id
        }
      });

      console.log(data);

      await Swal.fire('Actualizado', 'Los cambios fueron guardados', 'success');

      await router.push('/productos');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

      <Formik enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => actualizarInfoProducto(values)}>
        {props => (
          <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
              <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                  <input type="text" placeholder="Nombre" id="nombre"
                         value={props.values.nombre} onChange={props.handleChange} onBlur={props.handleBlur}
                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                {props.touched.nombre && props.errors.nombre
                  ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{props.errors.nombre}</p>
                  </div>
                  : null
                }

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Existencia</label>
                  <input type="number" placeholder="Existencia" id="existencia"
                         value={props.values.existencia} onChange={props.handleChange} onBlur={props.handleBlur}
                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                {props.touched.existencia && props.errors.existencia
                  ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{props.errors.existencia}</p>
                  </div>
                  : null
                }

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                  <input type="number" placeholder="Prcio" id="precio"
                         value={props.values.precio} onChange={props.handleChange} onBlur={props.handleBlur}
                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                {props.touched.precio && props.errors.precio
                  ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{props.errors.precio}</p>
                  </div>
                  : null
                }

                <input type="submit"
                       className="bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 uppercase"
                       value="Agregar nuevo producto"/>
              </form>
            </div>
          </div>
        )}
      </Formik>
    </Layout>
  );
};

export default EditarProducto;