import React from 'react';
import {gql, useMutation} from "@apollo/client";
import Swal from "sweetalert2";
import Router from "next/router";

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
        eliminarProducto(id: $id)
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

const Producto = ({producto}) => {
  const {id, nombre, existencia, precio} = producto;
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
      const {obtenerProductos} = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: obtenerProductos.filter(productoActual => productoActual.id !== producto.id),
        }
      })
    }
  });

  const confirmarEliminarProducto = async (id) => {

    const result = await Swal.fire({
      title: 'Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, confirmo',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const {data} = await eliminarProducto({variables: {id}});
        console.log(data);

        Swal.fire(
          'Eliminado!',
          data.eliminarProducto,
          'success',
        )
      } catch (error) {
        console.log(error);
      }
    }

  };

  const editarProducto = async () => {
    Router.push({pathname: '/editarproducto/[id]', query: {id}});
  };

  return (
    <tr key={id}>
      <td className="border px-4 py-2">{nombre}</td>
      <td className="border px-4 py-2">{existencia}</td>
      <td className="border px-4 py-2">{precio}</td>
      <td className="border px-4 py-2">
        <button
          onClick={() => confirmarEliminarProducto(id)}
          className="flex justify-center items-center bg-red-800 text-white py-2 px-4 w-full rounded text-xs uppercase font-bold">
          Eliminar <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg></button>
      </td>
      <td className="border px-4 py-2">
        <button
          onClick={() => editarProducto()}
          className="flex justify-center items-center bg-green-600 text-white py-2 px-4 w-full rounded text-xs uppercase font-bold">
          Editar <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg></button>
      </td>
    </tr>
  );
};

export default Producto;