// src/Gasoline/Sales/SaleForm.js

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Alert,
} from "reactstrap";

export default function SaleForm({
  isOpen,
  toggle,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  fuels = [],
  bombs = [],
  metodosPago = [],
  banks = [],
  error,
  saleType,
  successMessage,
}) {
  const [paymentMethods, setPaymentMethods] = useState([
    { paymentId: "", amount: "", bankId: "", cardNumber: "" },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (successMessage && saleType === 2) {
      const timer = setTimeout(() => {
        setFormData((prev) => ({ ...prev, successMessage: "" }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, saleType]);

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

  const calcularMonto = (galones, fuelId) => {
    const selectedFuel = fuels.find((f) => f.fuelId === fuelId);
    if (!selectedFuel) return "";
    const precio = selectedFuel.salePriceGalon || 0;
    return (parseFloat(galones) * parseFloat(precio)).toFixed(2);
  };

  const removePaymentMethod = (index) => {
    const updated = [...paymentMethods];
    updated.splice(index, 1);
    setPaymentMethods(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      fuelId: formData.fuelId,
      bombId: formData.bombId,
      customerNit: formData.customerNit,
      amount: parseFloat(formData.amount),
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
    };

    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Venta" : "Registrar Venta"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            {error && (
              <Alert color="danger" className="mb-4">
                {error}
              </Alert>
            )}
            <Label for="customerNit">NIT del Cliente</Label>
            <Input
              name="customerNit"
              value={formData.customerNit || ""}
              onChange={handleChange}
              disabled={saleType !== 1}
              required={saleType === 1}
            />
          </FormGroup>

          <FormGroup>
            <Label for="fuelId">Combustible</Label>
            <Input
              type="select"
              name="fuelId"
              value={formData.fuelId || ""}
              onChange={(e) => {
                const fuelId = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  fuelId,
                  amount:
                    saleType === 1 && prev.consumedQuantity && fuelId
                      ? calcularMonto(prev.consumedQuantity, fuelId)
                      : prev.amount,
                }));
              }}
              required
            >
              <option value="">Seleccione...</option>
              {fuels.map((fuel) => (
                <option key={fuel.fuelId} value={fuel.fuelId}>
                  {fuel.fuelName}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="bombId">Bomba</Label>
            <Input
              type="select"
              name="bombId"
              value={formData.bombId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {bombs.map((bomb) => (
                <option key={bomb.bombId} value={bomb.bombId}>
                  Bomba #{bomb.bombNumber}
                </option>
              ))}
            </Input>
          </FormGroup>

          {saleType === 1 && (
            <FormGroup>
              <Label for="consumedQuantity">
                Cantidad (galones){" "}
                <small className="text-muted">(opcional)</small>
              </Label>
              <Input
                type="number"
                name="consumedQuantity"
                value={formData.consumedQuantity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    consumedQuantity: value,
                    // Si hay precio por galón, actualiza amount automáticamente
                    amount:
                      value && formData.fuelId
                        ? calcularMonto(value, formData.fuelId)
                        : prev.amount,
                  }));
                }}
                onWheel={(e) => e.target.blur()}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label for="amount">Monto Total</Label>
            <Input
              type="number"
              name="amount"
              value={formData.amount || ""}
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              disabled={saleType !== 1}
              required={saleType === 1}
            />
          </FormGroup>
          {successMessage && saleType === 2 && (
            <Alert color="success" className="mb-3">
              {successMessage}
            </Alert>
          )}
          {saleType === 1 && (
            <>
              <hr />
              <h5>Métodos de Pago</h5>
              {paymentMethods.map((pm, index) => (
                <div key={index} className="border p-3 mb-3 rounded bg-light">
                  <Row form>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Método</Label>
                        <Input
                          type="select"
                          value={pm.paymentId}
                          onChange={(e) =>
                            handlePaymentChange(
                              index,
                              "paymentId",
                              e.target.value
                            )
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
                    <Row form>
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
                              handlePaymentChange(
                                index,
                                "bankId",
                                e.target.value
                              )
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
            </>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Guardar
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
