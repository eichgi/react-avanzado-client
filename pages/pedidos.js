import React from 'react';
import Layout from "../components/Layout";
import Link from "next/link";
import {useQuery, gql} from "@apollo/client";
import Pedido from "../components/Pedido";

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            estado
            pedido {
                id
                nombre
                cantidad
            }
            total
        }
    }
`;

const Pedidos = () => {

  const {data, loading, error} = useQuery(OBTENER_PEDIDOS);

  if (loading) {
    return null
  }

  const {obtenerPedidosVendedor} = data;
  console.log(obtenerPedidosVendedor);

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>

        <Link href="/nuevopedido">
          <a
            className="bg-blue-800 text-white py-2 px-5 my-3 inline-block rounded text-sm hover:bg-gray-800 uppercase font-bold">Nuevo
            Pedido</a>
        </Link>

        {
          obtenerPedidosVendedor.length
            ? (
              obtenerPedidosVendedor.map(pedido => <Pedido key={pedido.id} pedido={pedido}/>)
            )
            : (
              <p className="mt-5 text-center text-2xl">No hay pedidos</p>
            )
        }

      </Layout>
    </div>
  );
};

export default Pedidos;