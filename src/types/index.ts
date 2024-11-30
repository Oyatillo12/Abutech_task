import { ReactNode } from "react";

export interface AttachmentType {
    size?: number | null;
    url?: string;
    origName?: string;
    name?: string;
}

export interface ContractType {
    id?: number
    title: string;
    createdAt?: string
    courseId: number;
    attachment: AttachmentType
    course?: CourseType;
    action?: ReactNode
}

export interface GetContractsParamsType {
    page?: number;
    perPage?: number;
    search?: string;
};

export interface LoginResponse {
    data: {
        accessToken: string
    }
}
export interface CourseType {
    id: number;
    name: string;
    createdAt?: string;
    disciplineId?: number;
    disciplineName?: string;
    hasCurriculum?: boolean;
    hasStudyMonths?: boolean;
    imageIllustration?: string;

}

export interface responseData {
    contracts: ContractType[];
    total: number;
}

export type LoginType = {
    login: string;
    password: string;
  }