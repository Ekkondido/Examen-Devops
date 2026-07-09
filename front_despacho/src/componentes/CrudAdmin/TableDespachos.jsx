import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);

  const formatValue = (value, fallback = "Sin dato") => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    return value;
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Sin valor";
    }
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const formatDate = (value) => {
    if (!value) {
      return "Pendiente";
    }
    const normalizedDate = String(value).split("T")[0];
    const [year, month, day] = normalizedDate.split("-");

    if (!year || !month || !day) {
      return value;
    }
    return `${day}/${month}/${year}`;
  };

  const formatDespachoStatus = (value) =>
    value ? "Despacho entregado" : "Despacho pendiente";

  const despacho = async () => {
    try {
      const response = await axios.get("/api/v1/despachos", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log("Datos recibidos en Despachos:", response.data);
      // Validamos que la respuesta sea un arreglo antes de guardarla
      setDespachos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al traer despachos:", error);
    }
  };

  useEffect(() => {
    despacho();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">
            <table className="table-fixed">
              <thead>
                <tr className="py-10">
                  <th className="pr-10">Orden de despacho</th>
                  <th className="pr-10">Orden de compra</th>
                  <th className="pr-10">Dirección de entrega</th>
                  <th className="pr-10">Fecha despacho</th>
                  <th className="pr-10">Patente Camión</th>
                  <th className="pr-10">Entregado</th>
                  <th className="pr-10">Intentos de entrega</th>
                  <th className="pr-10">Valor compra</th>
                  <th className="pr-10">Acción</th>
                </tr>
              </thead>
              <tbody>
                {despachos.map((item, index) => {
                  // Mapeo seguro dinámico (si viene camelCase o snake_case desde el backend)
                  const idDespachoReal = item.idDespacho ?? item.id_despacho ?? `index-${index}`;
                  const idCompraReal = item.idCompra ?? item.id_compra;
                  const direccionCompraReal = item.direccionCompra ?? item.direccion_compra;
                  const fechaDespachoReal = item.fechaDespacho ?? item.fecha_despacho;
                  const patenteCamionReal = item.patenteCamion ?? item.patente_camion;
                  const despachadoReal = item.despachado;
                  const intentoReal = item.intento;
                  const valorCompraReal = item.valorCompra ?? item.valor_compra;

                  return (
                    <tr key={idDespachoReal}>
                      <td className="pr-10 py-10 items-center">
                        {formatValue(idDespachoReal, "N/A")}
                      </td>
                      <td className="pr-10 py-10 items-center">
                        {formatValue(idCompraReal)}
                      </td>
                      <td className="pr-10 py-10 items-center">
                        {formatValue(direccionCompraReal)}
                      </td>
                      <td className="pr-10 py-10 items-center">
                        {formatDate(fechaDespachoReal)}
                      </td>
                      <td className="pr-10 py-10 items-center">
                        {formatValue(patenteCamionReal)}
                      </td>
                      <td className="pr-10 py-10 items-center">
                        {formatDespachoStatus(despachadoReal)}
                      </td>
                      <td className="pr-10 py-10 items-center">
                        {formatValue(intentoReal, 0)}
                      </td>
                      <td className="pr-10 py-10 items-center">
                        {formatCurrency(valorCompraReal)}
                      </td>
                      <td>
                        <button
                          onClick={() => handleAbrirModal(item)}
                          className="py-1 bg-orange-200 px-8 rounded-xl shadow-md hover:bg-orange-300/70 transition-all duration-300 "
                        >
                          Cerrar despacho
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              setOpenModal(false);
              despacho();
            }}
          />
        )}
      </Modal>
    </>
  );
};
