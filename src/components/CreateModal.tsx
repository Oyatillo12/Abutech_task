import { Button, Modal, Select } from 'antd'
import React, { SetStateAction, useEffect, useState } from 'react'
import { FileIcon } from '../assets/images/icon';
import { useAddContractMutation, useCoursesQuery, useUploadFileMutation } from '../hooks/useContracts';
import { DeleteOutlined } from '@ant-design/icons';
import { ContractType, CourseType } from '../types';
import toast, { Toaster } from 'react-hot-toast';

interface ModalType {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CustomModal: React.FC<ModalType> = ({ open, setOpen }) => {
    // contract Datas to add contract
    const [file, setFile] = useState<FileList | null>(null)
    const [title, setTitle] = useState<string>('');
    const [courseId, setCourseId] = useState<number | string>('');

    // contract and courses query and mutation
    const { data: coursesData = [], } = useCoursesQuery({ page: 1, perPage: 3 });
    const uploadFileMutattion = useUploadFileMutation();
    const addContractMutation = useAddContractMutation();

    // set courses data start
    const [courses, setCourses] = useState<CourseType[]>([]);
    useEffect(() => {
        if (coursesData.length > 0) {
            setCourseId(coursesData[0].id);
            setCourses(
                (coursesData ?? []).map((item: CourseType) => ({
                    id: item.id,
                    name: item.name,
                }))
            );
        }
    }, [JSON.stringify(coursesData)]);
    // set courses data end

    function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length) {
            const allowedFileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; 
            const allowedExtension = ".docx";
            const selectedFile = e.target.files[0];

            if (selectedFile.type !== allowedFileType && !selectedFile.name.endsWith(allowedExtension)) {
                toast.error("Faqat .docx formatdagi faylni yuklang!");
                return;
            }
            setFile(e.target.files);
        }
    }

    // add contract
    function handleAddSubmit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        if (file && file[0]) {
            uploadFileMutattion.mutate(file[0], {
                onSuccess: (res) => {
                    const data: ContractType = {
                        title,
                        courseId: courseId == 'all' ? 0 : Number(courseId),
                        attachment: {
                            origName: res[0].fileName,
                            url: res[0].path,
                            size: res[0].size,
                        }
                    }
                    addContractMutation.mutate(data, {
                        onSuccess: () => {
                            setOpen(false);
                            setFile(null);
                            setTitle('');
                            setCourseId('all');
                            toast.success("Shartnoma kiritildi!");
                        },
                        onError: () => {
                            toast.error("Takrorlangan malumot");
                        }
                    })
                }
            })
        }
    };

    return (
        <>
            <Toaster position='top-center' reverseOrder={false} />
            <Modal footer={false} open={open} onCancel={() => setOpen(false)}>
                <h2 className='text-[18px] text-[#0F1826] leading-[27px] mb-6'>Shartnoma yaratish</h2>
                <form onSubmit={handleAddSubmit} autoComplete='off' className='w-full flex flex-col space-y-6'>
                    <label htmlFor="kurs">
                        <span className='mb-2 block text-[14px] leading-[21px]'>Kurs </span>
                        <Select
                            size='large'
                            style={{ width: "100%", }}
                            onChange={(value) => setCourseId(value)}
                            options={courses.map((data: CourseType) => {
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
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className='w-full py-3 px-4 !border-[1px] !border-[#E3E3E3] rounded-lg outline-none' name='title' placeholder='Nomi' required type="text" />
                    </label>
                    <label className={`flex py-[13px] relative !border-[1px] border-dashed rounded-lg !border-[#E3E3E3] items-center justify-center w-full space-x-4 text-[14px] leading-[18px] text-[#0EB182]`} htmlFor="file">
                        {file ? null : <FileIcon />}
                        <span>{file ? file[0]?.name : "Fayl biriktiring"}</span>
                        {file ? null : <input onChange={handleChangeFile} accept='.docx' id='file' className='hidden' required type="file" />}
                    </label>
                    {file ? <Button onClick={() => setFile(null)} type='dashed' htmlType='button' className='z-50 absolute right-[30px] bottom-[96px] my-auto !text-[#FC7857] p-1 rounded-md !bg-[#F7F8F9]'><DeleteOutlined /></Button> : null}
                    <div className='flex items-center justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} className='hover:!border-[#0EB182] hover:!text-[#0EB182]' htmlType='button'>Bekor qilish</Button>
                        <Button loading={uploadFileMutattion.isPending} className='!bg-[#0EB182] text-white hover:!text-white !border-none hover:!bg-[#0EB182]/80' htmlType='submit'>Saqlash</Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default CustomModal
