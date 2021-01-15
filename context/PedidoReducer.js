import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
} from "../types";

const PedidoReducer = (state, action) => {
  switch (action.type) {
    case SELECCIONAR_CLIENTE:
      return {...state, cliente: action.payload};
    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        //productos: [...productos, action.payload],
        productos: action.payload,
      }
    case CANTIDAD_PRODUCTOS:

      break;
    default:
      return state;
  }
};

export default PedidoReducer;