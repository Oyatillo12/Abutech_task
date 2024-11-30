import { LoginResponse } from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import { LoginType } from "../page/LoginPage";


export const login = async (data?: LoginType):Promise<LoginResponse> => {
    const response = await useAxios(false).post('/api/staff/auth/sign-in', data);
    return response.data;
}