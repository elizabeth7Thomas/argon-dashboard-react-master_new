// src/Payment/utils/apiErrorHandler.js
export const handleBrokerError = (error) => {
  if (error.response) {
    const brokerResponse = error.response.data?.response;

    if (brokerResponse?._broker_message) {
      return brokerResponse._broker_message;
    }

    if (error.response.data?.message) {
      return error.response.data.message;
    }

    return `Error ${error.response.status}: ${error.response.statusText}`;
  }

  if (error.request) {
    return "No se recibió respuesta del servidor";
  }

  return error.message || "Error desconocido al conectar con el servidor";
};
