import React from 'react';
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {gql, useQuery, useMutation} from "@apollo/client";
import {Formik} from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!){
        obtenerCliente(id: $id){
            nombre
            apellido
            email
            empresa
            telefono
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input){
            id
            nombre
            apellido
            empresa
            email
            telefono
            vendedor
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

const EditarCliente = () => {
  const router = useRouter();
  const {query: {id}} = router;

  const {data, loading, error} = useQuery(OBTENER_CLIENTE, {variables: {id}});
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
    update(cache, {data: {actualizarCliente}}) {

      /*const {obtenerClientesVendedor} = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO
      });

      const clientesActualizados = obtenerClientesVendedor.map(cliente => {
        return cliente.id === id ? actualizarCliente : cliente
      });

      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: clientesActualizados,
        }
      });*/

      cache.writeQuery({
        query: OBTENER_CLIENTE,
        variables: {id},
        data: {
          obtenerCliente: actualizarCliente,
        }
      })
    }
  });
  //console.log(data);

  const schemaValidation = Yup.object({
    nombre: Yup.string().required('El nombre es obligatorio'),
    apellido: Yup.string().required('El apellido es obligatorio'),
    empresa: Yup.string().required('La empresa es obligatoria'),
    email: Yup.string().email().required('El email es obligatorio'),
  });

  if (loading) {
    return null;
  }

  const actualizarInfoCliente = async (values) => {
    const {nombre, apellido, empresa, email, telefono} = values;

    try {
      const {data} = await actualizarCliente({variables: {id, input: {nombre, apellido, empresa, email, telefono}}});
      console.log(data);

      await Swal.fire('Actualizado', 'Los cambios fueron guardados', 'success');

      await router.push('/');

    } catch (error) {
      console.log(error);
    }
  };
  const {obtenerCliente} = data;

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik validationSchema={schemaValidation}
                  enableReinitialize
                  initialValues={obtenerCliente}
                  onSubmit={(values, functions) => {
                    actualizarInfoCliente(values);
                  }}>
            {props => {
              //console.log(props);
              return (
                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                      onSubmit={props.handleSubmit}>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                    <input type="text" placeholder="Nombre" id="nombre"
                           value={props.values.nombre}
                           onChange={props.handleChange}
                           onBlur={props.handleBlur}
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
                    <label className="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
                    <input type="text" placeholder="Apellido" id="apellido"
                           value={props.values.apellido}
                           onChange={props.handleChange}
                           onBlur={props.handleBlur}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div>
                  {props.touched.apellido && props.errors.apellido
                    ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.apellido}</p>
                    </div>
                    : null
                  }

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Empresa</label>
                    <input type="text" placeholder="Empresa" id="empresa" value={props.values.empresa}
                           onChange={props.handleChange} onBlur={props.handleBlur}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div>
                  {props.touched.empresa && props.errors.empresa
                    ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.empresa}</p>
                    </div>
                    : null
                  }

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" placeholder="Email" id="email" value={props.values.email}
                           onChange={props.handleChange} onBlur={props.handleBlur}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div>
                  {props.touched.email && props.errors.email
                    ? <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.email}</p>
                    </div>
                    : null
                  }

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                    <input type="tel" placeholder="Telefono" id="telefono" value={props.values.telefono}
                           onChange={props.handleChange} onBlur={props.handleBlur}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div>

                  <input type="submit"
                         className="bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 uppercase"
                         value="Guardar cambios"/>

                </form>
              )
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarCliente;