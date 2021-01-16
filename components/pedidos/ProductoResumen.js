import React, {useContext, useState, useEffect} from 'react';
import PedidoContext from "../../context/PedidoContext";

const ProductoResumen = ({producto}) => {
  const [cantidad, setCantidad] = useState(0);
  const pedidoContext = useContext(PedidoContext);
  const {cantidadProductos, actualizarTotal} = pedidoContext;

  useEffect(() => {
    actualizarCantidad();
    actualizarTotal();
  }, [cantidad]);

  const actualizarCantidad = () => {
    const nuevoProducto = {...producto, cantidad: Number(cantidad)};
    //console.log(nuevoProducto);
    cantidadProductos(nuevoProducto);
  };

  const {nombre, precio} = producto;

  return (
    <div>
      <div className="md:flex md:justify-between md:items-center mt-5">
        <div className="md:w-2/4 mb-2 md:mb-0">
          <p className="text-sm">{nombre}</p>
          <p className="text-sm">${precio}</p>
        </div>

        <input type="number" placeholder="Cantidad" onChange={(e) => setCantidad(e.target.value)} value={cantidad}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"/>
      </div>
    </div>
  );
};

export default ProductoResumen;