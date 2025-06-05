import axios from "axios";

const API_URL = "http://64.23.169.22:3761/broker/api/rest";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const obtenerBancos = async () => {
  try {
    const response = await axios.post(
      API_URL,
      {
        metadata: { uri: "pagos/bancos/obtener" },
        request: {}
      },
      { headers: getHeaders() }
    );
    return response.data.response.data.Bancos;
  } catch (error) {
    console.error("Error al obtener bancos:", error);
    throw error;
  }
};

export const crearBanco = async (nombre) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        metadata: { uri: "pagos/bancos/crear" },
        request: { nombre }
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear banco:", error);
    throw error;
  }
};

export const eliminarBanco = async (id) => {
  try {
    const response = await axios.put(
      API_URL,
      {
        metadata: { uri: `pagos/bancos/eliminar/${id}` },
        request: {}
      },
      { headers: getHeaders() }
    );
    
    if (response.data.response._broker_status === 200) {
      return { success: true, message: response.data.response.data.mensaje };
    }
    throw new Error(response.data.response._broker_message);
  } catch (error) {
    console.error("Error al eliminar banco:", error);
    return { 
      success: false, 
      message: error.response?.data?.response?._broker_message || "Error al eliminar el banco" 
    };
  }
};