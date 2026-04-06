export const handleApiError = (error) => {
  if (error.response) {
    return {
      type: "server",
      message: error.response.data?.message || error.response.data?.detail || "Server error occurred",
      status: error.response.status,
      details: error.response.data
    };
  } else if (error.request) {
    return {
      type: "network",
      message: "Cannot connect to server. Please check your connection.",
      status: null
    };
  } else {
    return {
      type: "client",
      message: error.message || "An unexpected error occurred",
      status: null
    };
  }
};

export const getErrorMessage = (error) => {
  const apiError = handleApiError(error);
  return apiError.message;
};

export const isErrorNetwork = (error) => {
  return handleApiError(error).type === "network";
};

export const isErrorServer = (error) => {
  return handleApiError(error).type === "server";
};

export const getErrorStatus = (error) => {
  return handleApiError(error).status;
};

export const createFormData = (data, files = null, fileKey = "files") => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  if (files) {
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append(fileKey, file);
      });
    } else {
      formData.append(fileKey, files);
    }
  }

  return formData;
};
