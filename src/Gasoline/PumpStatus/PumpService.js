import axios from "axios";

const API_BASE = "http://64.23.169.22:3761/broker/api/rest";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const handleBrokerResponse = (response) => {
  // Extraer datos de cualquier estructura posible
  if (response.data?.response?.data) return response.data.response.data;
  if (response.data?.response) return response.data.response;
  return response.data;
};

export const fetchPumps = async (filter = "all") => {
  let uri = "bomb/list";
  if (filter === "active") uri = "bomb/list/active";
  if (filter === "inactive") uri = "bomb/list/inactive";
  if (filter === "maintenance") uri = "bomb/list/maintenance";

  try {
    const response = await axios.post(
      API_BASE,
      {
        metadata: { uri },
        request: {},
      },
      { headers: getAuthHeader() }
    );
    
    const data = handleBrokerResponse(response);
    return data.bomb || data;
  } catch (error) {
    console.error("Error fetching pumps:", error);
    throw error.response?.data?.message || "Error al obtener bombas";
  }
};

export const fetchPumpById = async (bombId) => {
  try {
    const response = await axios.post(
      API_BASE,
      {
        metadata: { uri: `bomb/get/${bombId}` }, // Cambiado a 'get' que es más RESTful
        request: {},
      },
      { headers: getAuthHeader() }
    );
    
    const data = handleBrokerResponse(response);
    return data.bomb?.[0] || data;
  } catch (error) {
    console.error("Error fetching pump:", error);
    throw error.response?.data?.message || "Error al obtener la bomba";
  }
};

export const createPump = async (pumpData) => {
  try {
    const response = await axios.post(
      API_BASE,
      {
        metadata: { uri: "bomb/create" },
        request: pumpData,
      },
      { headers: getAuthHeader() }
    );
    
    const data = handleBrokerResponse(response);
    if (!data.bombId) throw new Error("No se recibió ID de bomba creada");
    return data;
  } catch (error) {
    console.error("Error creating pump:", error);
    throw error.response?.data?.message || "Error al crear bomba";
  }
};

export const updatePump = async (bombId, pumpData) => {
  try {
    const response = await axios.post(
      API_BASE,
      {
        metadata: { uri: `bomb/update/${bombId}` },
        request: pumpData,
      },
      { headers: getAuthHeader() }
    );
    
    const data = handleBrokerResponse(response);
    if (data._broker_status !== 200) throw new Error(data._broker_message);
    return data;
  } catch (error) {
    console.error("Error updating pump:", error);
    throw error.response?.data?.message || "Error al actualizar bomba";
  }
};

export const deletePump = async (bombId) => {
  try {
    const response = await axios.post(
      API_BASE,
      {
        metadata: { uri: `bomb/delete/${bombId}` },
        request: {},
      },
      { headers: getAuthHeader() }
    );
    
    const data = handleBrokerResponse(response);
    if (data._broker_status !== 200) throw new Error(data._broker_message);
    return data;
  } catch (error) {
    console.error("Error deleting pump:", error);
    throw error.response?.data?.message || "Error al eliminar bomba";
  }
};