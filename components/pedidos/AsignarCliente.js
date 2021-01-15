import React, {useContext, useEffect, useState} from 'react';
import Select from "react-select";
import {useQuery, gql} from "@apollo/client";
import PedidoContext from "../../context/PedidoContext";

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

const AsignarCliente = () => {

  const [cliente, setCliente] = useState([]);

  //Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const {agregarCliente} = pedidoContext;

  const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIO);

  useEffect(() => {
    //console.log(cliente);
    if (cliente) {
      agregarCliente(cliente);
    }
  }, [cliente]);

  const seleccionarCliente = (clientes) => {
    setCliente(clientes);
  };

  if (loading) {
    return null;
  }

  const {obtenerClientesVendedor} = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">Asigna un
        cliente al pedido</p>
      <Select
        classname="mt-3"
        options={obtenerClientesVendedor}
        onChange={(option) => seleccionarCliente(option)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => opciones.nombre}
        placeholder="Selecciona un cliente"
        noOptionsMessage={() => 'No hay resultados'}
      />
    </>
  );
};

export default AsignarCliente;