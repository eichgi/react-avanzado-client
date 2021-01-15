import React, {useState, useEffect, useContext} from 'react';
import Select from "react-select";
import {useQuery, gql} from "@apollo/client";
import PedidoContext from "../../context/PedidoContext";

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

const AsignarProducto = () => {

  const pedidoContext = useContext(PedidoContext);
  const {agregarProductos} = pedidoContext;
  const [productos, setProductos] = useState([]);
  const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    if (productos) {
      console.log(productos);
      agregarProductos(productos);
    }
  }, [productos]);

  const seleccionarProducto = (productos) => {
    setProductos(productos);
  };

  if (loading) {
    return null
  }

  const {obtenerProductos} = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">Asigna
        productos al pedido</p>
      <Select
        isMulti
        classname="mt-3"
        options={obtenerProductos}
        onChange={(option) => seleccionarProducto(option)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => `${opciones.nombre} - ${opciones.existencia} disponibles`}
        placeholder="Selecciona un producto"
        noOptionsMessage={() => 'No hay resultados'}
      />
    </>
  );
};

export default AsignarProducto;