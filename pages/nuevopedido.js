import React, {useContext, useState} from 'react';
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProducto from "../components/pedidos/AsignarProducto";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import {useRouter} from "next/router";
//Context pedidos
import PedidoContext from "../context/PedidoContext";
import Total from "../components/pedidos/Total";
import {useMutation, gql} from "@apollo/client";
import Swal from "sweetalert2";

const NUEVO_PEDIDO = gql`
    mutation nuevoPedido ($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id
        }
    }
`;

const Nuevopedido = () => {
  const router = useRouter();
  const [mensaje, guardarMensaje] = useState(null);

  // Utilizar context y extraer values
  const pedidoContext = useContext(PedidoContext);
  const {cliente, productos, total} = pedidoContext;

  //Mutation nuevo pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO);

  const validarPedido = () => {
    return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? ' opacity-50 cursor-not-allowed ' : '';
  };

  const crearNuevoPedido = async () => {
    const {id} = cliente;
    const pedido = productos.map(({id, cantidad, nombre, precio}) => {
      return {id, cantidad, nombre, precio};
    });
    try {

      const {data} = await nuevoPedido({
        variables: {
          input: {
            pedido,
            cliente: id,
            estado: "PENDIENTE",
            total
          }
        }
      });

      console.log(data);
      await Swal.fire('Pedido registrado exitosamente', '', 'success');

      router.push('/pedidos');

    } catch (error) {
      console.log(error);
      guardarMensaje(error.message);

      setTimeout(() => {
        guardarMensaje(null);
      }, 3000);
    }
  };

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo pedido</h1>

      {mensaje && mostrarMensaje()}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente/>

          <AsignarProducto/>

          <ResumenPedido/>

          <Total/>

          <button type="button" onClick={() => crearNuevoPedido()}
                  className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}>Registrar
            pedido
          </button>
        </div>
      </div>

    </Layout>
  );
};

export default Nuevopedido;