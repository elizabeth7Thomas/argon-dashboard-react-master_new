import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import axios from "axios";
import Header from "components/Headers/Header_alerta"; // o Header_venta si tienes uno específico
import SaleList from "../Sales/SaleList";
import SaleDetailsModal from "Gasoline/Sales/setDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGasPump,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import SaleForm from "../Sales/SaleForm";
import TransactionCompletionForm from "../Sales/TransactionCompletionForm";
import io from "socket.io-client";

export default function SalesPage() {
  const [modalForm, setModalForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalTipoVenta, setModalTipoVenta] = useState(false);
  const [tipoVenta, setTipoVenta] = useState(null); // 1 o
  const [fuels, setFuels] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [formError, setFormError] = useState("");
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [ventaLiberadaMsg, setVentaLiberadaMsg] = useState("");

  const payMethods = [
    { paymentId: 1, Metodo: "Efectivo" },
    { paymentId: 2, Metodo: "Tarjeta Crédito" },
    { paymentId: 3, Metodo: "Tarjeta Débito" },
    { paymentId: 4, Metodo: "Transacción" },
    { paymentId: 5, Metodo: "Tarjeta de Fidelidad" },
  ];
  const [banks, setBanks] = useState([]);
  const SOCKET_URL = "ws://64.23.169.22:3002";
  const socketRef = useRef(null);

  const toggleForm = () => {
    setModalForm(!modalForm);
    if (!modalForm) {
      setFormData({});
      setIsEditing(false);
      setFormError("");
    }
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      console.log("Conectado al WebSocket");
    });

    socketRef.current.on("totalTimeUpdated", (data) => {
      console.log("totalTimeUpdated recibido:", data);
      // Show the update of the status
      console.log(
        `Venta ${data.saleId} terminó con totalTime: ${data.totalTime} ms`
      );

      console.log(data);
      fetchUpdatedSale(data.saleId);

      const match = sales.find((s) => s.id === data.saleId);

      if (match) {
        // Opción 1: refrescarla con una petición si necesitas datos actualizados
        // Opción 2: usar el dato local (aquí usamos local)
        setPendingTransaction(match);
      } else {
        console.warn("No se encontró la venta en el estado local");
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("Desconectado del WebSocket");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleShow = (sale) => {
    setSelectedSale(sale);
    setShowDetails(true);
  };

  const fetchUpdatedSale = async (saleId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `sale/list/${saleId}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const sale = res.data?.response?.data;
      if (sale) {
        setPendingTransaction(sale);
      }
    } catch (err) {
      console.error("Error al obtener venta por ID:", err);
    }
  };

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userId = localStorage.getItem("userId");

    const payload = {
      type: tipoVenta,
      bomb: { bombId: data.bombId },
      fuel: { fuelId: data.fuelId },
      createdBy: { employeeId: userId, employeeName: user },
      cashRegisterId: 1,
    };

    if (tipoVenta === 1) {
      payload.amount = parseFloat(data.amount);
      payload.customer = { nit: data.customerNit || "CF" };
      payload.paymentMethods = data.paymentMethods;
    }

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "sale/create" },
          request: payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const saleRaw = response.data?.response?.data;
      const sale = saleRaw.sale || saleRaw;

      if (sale && socketRef.current) {
        if (tipoVenta === 2) {
          socketRef.current.emit("releaseBomb", {
            bombId: sale.bomb.bombId,
            saleId: sale.fuelSaleId,
            fuelId: sale.fuel.fuelId,
          });

          console.log("Emitido releaseBomb sin tiempo:", {
            bombId: sale.bomb.bombId,
            saleId: sale.fuelSaleId,
            fuelId: sale.fuel.fuelId,
          });

          setVentaLiberadaMsg(
            "✅ Bomba liberada correctamente. Puedes completar la venta una vez termine el suministro."
          );
          setTimeout(() => setVentaLiberadaMsg(""), 3000);
        } else {
          socketRef.current.emit("releaseBomb", {
            bombId: sale.bomb.bombId,
            maxTime: sale.totalTime,
            saleId: sale.fuelSaleId,
          });

          console.log("Emitido releaseBomb (tipo 1):", {
            bombId: sale.bomb.bombId,
            maxTime: sale.totalTime,
            saleId: sale.fuelSaleId,
          });
        }
      }

      if (sale?.status === 1) {
        setVentaLiberadaMsg("✅ Venta realizada correctamente");
        alert("✅ Venta realizada correctamente");
        setTimeout(() => setVentaLiberadaMsg(""), 3000);
      } else if (sale?.status === 2 || sale?.status === 4) {
        setVentaLiberadaMsg("⚠️ Atención:\n" + sale.paymentServiceMessage);
        setTimeout(() => setVentaLiberadaMsg(""), 3000);
        alert("⚠️ Atención:\n" + sale.paymentServiceMessage);
        setPendingTransaction(sale);
      }

      await fetchSales();
      if (tipoVenta === 1) {
        setModalForm(false);
      }
      // Puedes volver a cargar ventas si deseas
    } catch (err) {
      const brokerMessage = err.response?.data?.response?.data?.message;
      const defaultMessage = err.message || "Ocurrió un error inesperado.";

      setFormError(brokerMessage || defaultMessage);
    }
  };
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token de autenticación no encontrado");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "sale/list" },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const salesData = response.data?.response?.data;

      if (Array.isArray(salesData)) {
        setSales(salesData);
      } else {
        setError("Respuesta inválida del broker");
      }
    } catch (err) {
      console.error("Error al obtener ventas:", err);
      setError("Error al conectar con el broker");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    

    const fetchOptions = async () => {
      try {
        const [fuelRes, bombRes, bankRes] = await Promise.all([
          axios.post(
            "http://64.23.169.22:3761/broker/api/rest",
            {
              metadata: { uri: "fuelType/list" },
              request: {},
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            "http://64.23.169.22:3761/broker/api/rest",
            {
              metadata: { uri: `bomb/list/employee/${userId}` },
              request: {},
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            "http://64.23.169.22:3761/broker/api/rest",
            {
              metadata: { uri: "pagos/bancos/obtener" },
              request: {},
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        
        setFuels(fuelRes.data.response.data || []);
        setBombs(bombRes.data.response.data || []);

        const rawBombs = bombRes.data.response.data;
        const bombsArray = Array.isArray(rawBombs) ? rawBombs : [rawBombs];
        setBombs(bombsArray);
        setBanks(bankRes.data.response.data.Bancos || []);
      } catch (err) {
        console.error("Error al cargar combustibles o bombas:", err);
      }
    };

    fetchOptions();
  }, []);

  const handleEdit = (sale) => {
    setPendingTransaction(sale);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar esta venta?")) {
      // Por ahora, solo lo quitamos del estado local
      setSales((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <>
      <Header />
      <Container className="py-4" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Registro de Ventas</h3>
                <Button color="primary" onClick={() => setModalTipoVenta(true)}>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Nueva venta
                </Button>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <Spinner color="primary" />
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <SaleList
                    sales={sales}
                    onEdit={handleEdit}
                    onShow={handleShow}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
          <SaleForm
            isOpen={modalForm}
            toggle={() => setModalForm(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            fuels={fuels}
            bombs={bombs}
            metodosPago={payMethods}
            banks={banks}
            error={formError}
            saleType={tipoVenta}
            successMessage={ventaLiberadaMsg}
          />
          {pendingTransaction && (
            <TransactionCompletionForm
              originalSale={pendingTransaction}
              onClose={() => setPendingTransaction(null)}
              banks={banks}
              metodosPago={payMethods}
              onRefreshSales={fetchSales}
            />
          )}
        </Row>
      </Container>

      <Modal isOpen={modalTipoVenta} toggle={() => setModalTipoVenta(false)}>
        <ModalHeader toggle={() => setModalTipoVenta(false)}>
          Selecciona el tipo de venta
        </ModalHeader>
        <ModalBody>
          <Button
            color="info"
            block
            onClick={() => {
              setTipoVenta(1);
              setModalTipoVenta(false);
              setFormData({});
              setModalForm(true);
            }}
          >
            Tipo 1 - Bomba limitada
          </Button>
          <Button
            color="secondary"
            block
            onClick={() => {
              setTipoVenta(2);
              setModalTipoVenta(false);
              setFormData({});
              setModalForm(true);
            }}
          >
            Tipo 2 - Bomba libre
          </Button>
        </ModalBody>
      </Modal>

      <SaleDetailsModal
        isOpen={showDetails}
        toggle={() => setShowDetails(false)}
        sale={selectedSale}
      />
    </>
  );
}
