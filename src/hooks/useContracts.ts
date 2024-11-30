import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addContract, editContract, getContracts,  getCourses, uploadFile } from "../api/contracts";
import { AttachmentType, ContractType, CourseType, GetContractsParamsType, responseData } from "../types";


export const useContractsQuery = (params: GetContractsParamsType) => {
    return useQuery<responseData, Error>({
        queryKey: ["contracts", params],
        queryFn: () => getContracts(params)
    })
};

export const useCoursesQuery = (params: GetContractsParamsType) => {
    return useQuery<CourseType[], Error>({
        queryKey: ["courses", params],
        queryFn: () => getCourses(params)
    })
};

export const useUploadFileMutation = () => {
    return useMutation({
        mutationFn: (file: File | undefined | AttachmentType) => uploadFile(file),
        onSuccess: (data) => {
            console.log("File uploaded successfully", data);
        }
    });
}

export const useAddContractMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<ContractType, Error, ContractType>({
        mutationFn: (data: ContractType) => addContract(data), 
        onSuccess: (data) => {
            console.log('Contract added succexssfully', data);
            queryClient.invalidateQueries({queryKey:['contracts']});
        },
    })
}

export const useEditContractMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        ContractType, 
        Error,       
        { id: number; data: ContractType }
    >({
        mutationFn: ({ id, data }) => editContract(id, data), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
        },
    });
}