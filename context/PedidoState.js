import React, {useReducer} from 'react';
import PedidoContext from "./PedidoContext";
import PedidoReducer from './PedidoReducer';

import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
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

  return (
    <PedidoContext.Provider
      value={{
        total: state.total,
        agregarCliente,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;