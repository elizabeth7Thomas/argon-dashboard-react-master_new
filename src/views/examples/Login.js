import React, { useState } from "react";
import axios from "axios";
import { Button, Card,CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Row, Col, Alert, Spinner} from "reactstrap";

const Login = () => {
  const [username, setUsername] = useState("javiergarcia.4534");
  const [password, setPassword] = useState("Ml8NusZSOI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/POST/autenticacion",
        {
          metadata: {
            uri: null
          },
          request: {
            usuario: username,
            password: password
          }
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Respuesta de autenticación:", response.data);

      // Acceder al token correctamente
      const token = response.data?.response?._broker_session_token;

      if (token) {
        localStorage.setItem("token", token); // Guarda el token
        setSuccess("Autenticación exitosa");

        // Redirige al usuario
        setTimeout(() => {
          window.location.href = "/admin/index";
        }, 1000);
      } else {
        setError("No se recibió token en la respuesta");
      }
    } catch (err) {
      console.error("Error de autenticación:", err);
      setError(
        err.response?.data?.mensaje ||
          "Error al conectar con el servidor de autenticación"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardHeader className="bg-transparent pb-5">
          <h3 className="text-center">Iniciar Sesión</h3>
        </CardHeader>
        <CardBody className="px-lg-5 py-lg-5">
          {error && (
            <Alert color="danger" className="mb-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="success" className="mb-4">
              {success}
            </Alert>
          )}
          <Form role="form" onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Usuario"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Contraseña"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <div className="custom-control custom-control-alternative custom-checkbox">
              <input
                className="custom-control-input"
                id="customCheckLogin"
                type="checkbox"
              />
              <label
                className="custom-control-label"
                htmlFor="customCheckLogin"
              >
                <span className="text-muted">Recordarme</span>
              </label>
            </div>
            <div className="text-center">
              <Button
                className="my-4"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Procesando...
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <Row className="mt-3">
        <Col xs="6">
          <button
            className="text-light btn btn-link p-0"
            type="button"
            onClick={(e) => e.preventDefault()}
          >
            <small>¿Olvidaste tu contraseña?</small>
          </button>
        </Col>
        <Col className="text-right" xs="6">
          <button
            className="text-light btn btn-link p-0"
            type="button"
            onClick={(e) => e.preventDefault()}
          >
            <small>Crear cuenta nueva</small>
          </button>
        </Col>
      </Row>
    </Col>
  );
};

export default Login;
