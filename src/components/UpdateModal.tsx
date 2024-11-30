import React, { SetStateAction, useEffect, useState } from 'react'
import { AttachmentType, ContractType, CourseType } from '../types'
import toast, { Toaster } from 'react-hot-toast';
import { Button, Modal, Select } from 'antd';
import {  useCoursesQuery, useEditContractMutation, useUploadFileMutation } from '../hooks/useContracts';
import { FileIcon } from '../assets/images/icon';
import { DeleteOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../hooks/useAxios';


interface ModalType {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    id: number;
}

const UpdateModal: React.FC<ModalType> = ({ open, setOpen, id }) => {
    // contracts values
    const [file, setFile] = useState<AttachmentType | undefined | File>(undefined)
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState<number | string | undefined>(1);

    // get Edit contract information
    const axiosInstance = useAxios();
    const { data: contractData, isLoading, isError } = useQuery<ContractType, | Error>({
        queryKey: ["contract", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/staff/contracts/${id}`);
            return response.data.data;
        },
        enabled: !!id
    });

    // upload file mutation and editmtation and get course information
    const uploadFileMutattion = useUploadFileMutation();
    const editMutattion = useEditContractMutation();
    const { data = [], } = useCoursesQuery({ page: 1, perPage: 3 });

    // if isError change setErr
    const [err, setErr] = useState<boolean>(false);
    useEffect(() => {
        setErr(isError);
    }, [isError])

    // get contractData title .... 
    useEffect(() => {
        setErr(false);
        if (contractData) {
            setCourseId(contractData.course?.id);
            setTitle(contractData.title);
            setFile(contractData.attachment);
        }
    }, [JSON.stringify(contractData), id])

    // get file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // edit function start
    function handleUpadate(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        if (file instanceof File) {
            uploadFileMutattion.mutate(file, {
                onSuccess: (res) => {
                    const data: ContractType = {
                        title,
                        courseId: Number(courseId),
                        attachment: {
                            origName: res[0].fileName || file.name,
                            url: res[0].path,
                            size: res[0].size,
                        }
                    }
                    editMutattion.mutate({ id, data }, {
                        onSuccess: () => {
                            setOpen(false);
                            setFile(undefined);
                            setTitle('');
                            setCourseId('all');
                            toast.success("Shartnoma Tahrirlandi!");
                        },
                        onError: () => {
                                toast.error("Takrorlangan malumot");
                        }
                    })
                },
                onError: () => {
                    toast.error("Xatolik bor fileda!");
                }
            })
        } else if (file && typeof file === 'object' && 'origName' in file) {
            const data: ContractType = {
                title,
                courseId: Number(courseId),
                attachment: file,
            };

            editMutattion.mutate(
                { id, data },
                {
                    onSuccess: () => {
                        setOpen(false);
                        setFile(undefined);
                        setTitle('');
                        setCourseId('all');
                        toast.success("Shartnoma Tahrirlandi!");
                    },
                    onError: () => {
                            toast.error("Takrorlangan malumot");
                    },
                }
            );
        } else {
            toast.error("Faylni biriktiring!");
        }
    }
    //  edit function end
    return (
        <>
            <Toaster position='top-center' reverseOrder={false} />
            {err ? toast.error("API XATO BOR") : <Modal footer={false} loading={isLoading} open={open} onCancel={() => setOpen(false)}>
                <h2 className='text-[18px] text-[#0F1826] leading-[27px] mb-6'>Shartnoma o'zgartirish</h2>
                <form onSubmit={handleUpadate} autoComplete='off' className='w-full flex flex-col space-y-6'>
                    <label htmlFor="kurs">
                        <span className='mb-2 block text-[14px] leading-[21px]'>Kurs </span>
                        <Select
                            size='large'
                            style={{ width: "100%", }}
                            onChange={(value) => setCourseId(value)}
                            options={data.map((data: CourseType) => {
                                return {
                                    value: String(data.id),
                                    label: data.name,
                                }
                            })}
                            value={String(courseId)}
                        />
                    </label>
                    <label htmlFor="name">
                        <span className='mb-2 block text-[14px] leading-[21px]'>Nomi</span>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className='w-full py-2 px-4 !border-[1px] !border-[#E3E3E3] rounded-lg outline-none' name='title' placeholder='Nomi' required type="text" />
                    </label>
                    <label className={`flex py-[12px] relative !border-[1px] border-dashed rounded-lg !border-[#E3E3E3] items-center justify-center w-full space-x-4 text-[14px] leading-[18px] text-[#0EB182]`} htmlFor="file">
                        <FileIcon />
                        <span>{file ? (file instanceof File ? file.name : file.origName) : "Fayl biriktiring"}</span>
                        {file ? null : <input onChange={handleFileChange} accept='.docx' id='file' className='hidden' type="file" />}
                    </label>
                    {file ? <Button onClick={() => setFile(undefined)} type='dashed' htmlType='button' className='z-50 absolute right-[30px] bottom-[94px] my-auto !text-[#FC7857] px-[6px] rounded-md !bg-[#F7F8F9]'><DeleteOutlined /></Button> : null}
                    <div className='flex items-center justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} className='hover:!border-[#0EB182] hover:!text-[#0EB182]' htmlType='button'>Bekor qilish</Button>
                        <Button className='!bg-[#0EB182] text-white hover:!text-white !border-none hover:!bg-[#0EB182]/80' htmlType='submit'>O'zgartirish</Button>
                    </div>
                </form>
            </Modal>}
        </>
    )
}

export default UpdateModal
