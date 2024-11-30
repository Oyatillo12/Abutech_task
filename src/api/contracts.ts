import { useAxios } from "../hooks/useAxios"
import { AttachmentType, ContractType, GetContractsParamsType } from "../types";

export const uploadFile = async (file:File | undefined | AttachmentType) => {
  if(!file) return;
  const response = await useAxios().post('/api/staff/upload/contract/attachment', {
    files: file
  }, {
    headers: {
      'Content-Type':'multipart/form-data'
    },
  });
  return response.data.data;
}

// get courses function
export const getCourses = async (params?: GetContractsParamsType) => {
  const response = await useAxios(true).get('/api/staff/courses', { params })
  return response.data.data.courses;
};

// get all contracts function
export const getContracts = async (params?: GetContractsParamsType) => {
  const response = await useAxios(true).get('/api/staff/contracts/all', { params })
  return response.data.data;
};

// add contractfunction
export const addContract = async (formData: ContractType) => {
  const response = await useAxios().post('api/staff/contracts/create', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Edit contract function
export const editContract = async (id: number, data: ContractType) => {
  const response = await useAxios().put(`/api/staff/contracts/${id}`, data);
  return response.data;
};
