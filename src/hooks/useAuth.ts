import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { LoginType } from "../types";
import { LoginResponse } from "../types";

export const useLoginMutation = () => {
    return useMutation<LoginResponse, Error, LoginType>({
        mutationFn: login,
        onSuccess: (res) => {
            localStorage.setItem('token', res.data.accessToken);
        }
    });
};