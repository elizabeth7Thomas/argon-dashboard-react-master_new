import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Alert,
} from "reactstrap";
import axios from "axios";

export default function TransactionCompletionForm({
  originalSale,
  onClose,
  banks = [],
  metodosPago = [],
  onRefreshSales,
}) {
  const [nit, setNit] = useState(originalSale?.customer?.nit || "");
  const [paymentMethods, setPaymentMethods] = useState([
    { paymentId: "", amount: "", bankId: "", cardNumber: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePaymentChange = (index, field, value) => {
    const updated = [...paymentMethods];
    updated[index][field] = value;
    setPaymentMethods(updated);
  };

  const addPaymentMethod = () => {
    if (paymentMethods.length < 4) {
      setPaymentMethods([
        ...paymentMethods,
        { paymentId: "", amount: "", bankId: "", cardNumber: "" },
      ]);
    }
  };

  const removePaymentMethod = (index) => {
    const updated = [...paymentMethods];
    updated.splice(index, 1);
    setPaymentMethods(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")
    const userId = localStorage.getItem("userId")

    const payload = {
      type: 1,
      customer: {
        nit: nit,
      },
      cashRegisterId: 1,
      paymentMethods: paymentMethods
        .filter((pm) => pm.paymentId && pm.amount)
        .map((pm) => {
          const base = {
            paymentId: parseInt(pm.paymentId),
            amount: parseFloat(pm.amount),
          };
          if (parseInt(pm.paymentId) === 2 || parseInt(pm.paymentId) === 3) {
            base.bankId = pm.bankId;
            base.cardNumber = pm.cardNumber;
          }
          return base;
        }),
      updatedBy: {
        employeeId: userId,
        employeeName: user
      },
    };

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest", // ajusta si el endpoint cambia
        {
          metadata: { uri: `sale/update/${originalSale.fuelSaleId}` }, // ajusta si el URI es diferente
          request: payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const venta = response.data?.response?.data;

      if (venta?.status === 1) {
        setSuccess("✅ Venta completada correctamente");
        setTimeout(() => {
          setSuccess("");
          onClose();
          onRefreshSales?.();
        }, 2000);
      } else if (venta?.status === 2 || venta?.status === 4) {
        setError(
          "⚠️ Atención: " +
            (venta?.paymentServiceMessage ||
              "Faltan datos para completar la venta.")
        );
       
      } else {
        setError("⚠️ Venta no se pudo completar correctamente.");
      }

      
    } catch (err) {
      const backendMessage =
        err.response?.data?.response?.data?.message || err.message;
      setError("❌ Error al completar la venta:\n" + backendMessage);
    }
  };

  return (
    <Modal isOpen={true} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>
        Completar Transacción Pendiente
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Combustible</Label>
            <Input value={originalSale.fuel?.fuelName || "N/A"} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Cantidad (galones)</Label>
            <Input value={originalSale.consumedQuantity} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Monto Total</Label>
            <Input value={originalSale.amount} disabled />
          </FormGroup>

          <FormGroup>
            <Label>NIT del Cliente</Label>
            <Input
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              required
            />
          </FormGroup>

          <hr />
          <h5>Métodos de Pago</h5>
          {paymentMethods.map((pm, index) => (
            <div key={index} className="border p-3 mb-3 rounded bg-light">
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label>Método</Label>
                    <Input
                      type="select"
                      value={pm.paymentId}
                      onChange={(e) =>
                        handlePaymentChange(index, "paymentId", e.target.value)
                      }
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {metodosPago.map((mp) => (
                        <option key={mp.paymentId} value={mp.paymentId}>
                          {mp.Metodo}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Monto</Label>
                    <Input
                      type="number"
                      value={pm.amount}
                      onChange={(e) =>
                        handlePaymentChange(index, "amount", e.target.value)
                      }
                      onWheel={(e) => e.target.blur()}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  {paymentMethods.length > 1 && (
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => removePaymentMethod(index)}
                    >
                      Quitar
                    </Button>
                  )}
                </Col>
              </Row>

              {(pm.paymentId === "2" || pm.paymentId === "3") && (
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Número de Tarjeta</Label>
                      <Input
                        value={pm.cardNumber}
                        onChange={(e) =>
                          handlePaymentChange(
                            index,
                            "cardNumber",
                            e.target.value
                          )
                        }
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Banco</Label>
                      <Input
                        type="select"
                        value={pm.bankId}
                        onChange={(e) =>
                          handlePaymentChange(index, "bankId", e.target.value)
                        }
                        required
                      >
                        <option value="">Seleccionar banco</option>
                        {banks.map((bank) => (
                          <option key={bank._id} value={bank._id}>
                            {bank.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              )}
            </div>
          ))}

          {paymentMethods.length < 4 && (
            <Button color="secondary" onClick={addPaymentMethod}>
              Agregar método de pago
            </Button>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Confirmar
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
