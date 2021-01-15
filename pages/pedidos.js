import React from 'react';
import Layout from "../components/Layout";
import Link from "next/link";

const Pedidos = () => {
  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>

        <Link href="/nuevopedido">
          <a
            className="bg-blue-800 text-white py-2 px-5 my-3 inline-block rounded text-sm hover:bg-gray-800 uppercase font-bold">Nuevo
            Pedido</a>
        </Link>

      </Layout>
    </div>
  );
};

export default Pedidos;