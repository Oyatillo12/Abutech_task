import { LoginResponse } from "../types";
import { useAxios } from "../hooks/useAxios";
import { LoginType } from "../types"; 


export const login = async (data?: LoginType):Promise<LoginResponse> => {
    const response = await useAxios(false).post('/api/staff/auth/sign-in', data);
    return response.data;
}