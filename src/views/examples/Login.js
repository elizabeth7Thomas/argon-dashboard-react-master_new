import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const Login = () => {
  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardHeader className="bg-transparent pb-5">
          <h3 className="text-center">Iniciar Sesión</h3>
        </CardHeader>
        <CardBody className="px-lg-5 py-lg-5">
          <Form role="form">
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
              <Button className="my-4" color="primary" type="button">
                Ingresar
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