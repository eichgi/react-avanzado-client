import React, {useContext} from 'react';
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";

//Context pedidos
import PedidoContext from "../context/PedidoContext";

const Nuevopedido = () => {

  // Utiklizar context y extraer values
  const pedidoContext = useContext(PedidoContext);
  //const {holaMundo} = pedidoContext;

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo pedido</h1>

      <AsignarCliente/>
    </Layout>
  );
};

export default Nuevopedido;