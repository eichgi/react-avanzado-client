import React, {useReducer} from 'react';
import PedidoContext from "./PedidoContext";
import PedidoReducer from './PedidoReducer';

import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  ACTUALIZAR_TOTAL,
} from '../types';

const PedidoState = ({children}) => {
  //State de pedidos
  const initialState = {
    cliente: {},
    productos: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(PedidoReducer, initialState);

  const agregarCliente = (cliente) => {
    console.log(cliente);

    dispatch({
      type: SELECCIONAR_CLIENTE,
      payload: cliente,
    });
  }

  //Modifica cantidades productos
  const cantidadProductos = (producto) => {
    console.log(producto);

    dispatch({
      type: CANTIDAD_PRODUCTOS,
      payload: producto,
    });
  };

  const agregarProductos = (productosSeleccionados) => {
    //console.log(productos);

    let nuevoState;

    if (state.productos.length > 0) {
      nuevoState = productosSeleccionados.map(producto => {
        const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id);
        return {...producto, ...nuevoObjeto};
      });
    } else {
      nuevoState = productosSeleccionados;
    }

    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: nuevoState,
    })
  };

  const actualizarTotal = () => {
    console.log('actualizando total...');

    dispatch({
      type: ACTUALIZAR_TOTAL,
    })
  }

  return (
    <PedidoContext.Provider
      value={{
        total: state.total,
        productos: state.productos,
        cliente: state.cliente,
        agregarCliente,
        agregarProductos,
        cantidadProductos,
        actualizarTotal,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;