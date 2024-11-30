import { useEffect, useState } from "react";
import CustomTable from "../components/CustomTable"
import { useContractsQuery } from "../hooks/useContracts";
import { MoreOutlined } from "@ant-design/icons";
import { Button, TableColumnsType } from "antd";
import { SearchIcon } from "../assets/images/icon";
import CustomModal from "../components/CreateModal";
import UpdateModal from "../components/UpdateModal";
import { ContractType } from "../types";
import useDebounce from "../hooks/useDebouce";

const columns: TableColumnsType<ContractType> = [
  {
    title: '#',
    dataIndex: 'id',
  },
  {
    title: 'Nomi',
    dataIndex: ['attachment', 'origName'],
  },
  {
    title: 'kurs',
    dataIndex: 'title',
  },
  { dataIndex: 'action' }
];

const ContractsPage = () => {
  // modal functions for open and close start
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  // modal functions for open and close end

  // give id to edit
  const [contractId, setContractId] = useState<number>(1);

  // pagination and sorting 
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);


  // set debouced search start
  const [searchValue, setSearchValue] = useState<string>("");
  const searchWaiting = useDebounce(searchValue, 600);
  // set debouced search end

  // get all contracts
  const [contracts, setContracts] = useState<ContractType[] | undefined>([]);
  const { data, isPending } = useContractsQuery({
    search: searchWaiting,
    page,
    perPage:pageSize
  });
  useEffect(() => {
    setContracts(data?.contracts.map((item: ContractType) => ({
      ...item,
      action: <MoreOutlined onClick={() => handleEditCLick(item.id)} key="more" className='scale-125' />
    })))
  }, [data]);

  const handleEditCLick = (id: number | undefined) => {
    if (id) {
      setContractId(id);
      setUpdateModalOpen(true);
    }
  }

  return (
    <div className="p-6">
      <div className='sm:p-6 p-3 bg-[#FBFBFB] flex items-center justify-between rounded-t-lg'>
        <label className='flex items-center space-x-[14px]' htmlFor="search">
          <div className="sm:!scale-100"><SearchIcon /></div>
          <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)} autoComplete='off' name='search' placeholder='Qidiruv' className='outline-none bg-transparent text-[16px] sm:text-[19px] leading-[26px] w-[60%] placeholder:text-[#667085]' type="text" />
        </label>
        <Button onClick={() => setOpenModal(true)} size='large' htmlType='button' className='!bg-[#0EB182] text-white hover:!text-white !border-none hover:!bg-[#0EB182]/80 text-[14px] sm:text-[16px]'>Qo‘shish</Button>
      </div>
      <CustomTable setPage={setPage} setPageSize={setPageSize} pagination={{pageSize, current:page, total:data?.total}} columns={columns} contracts={contracts} loading={isPending} rowKey="id" />
      <CustomModal open={openModal} setOpen={setOpenModal} />
      {updateModalOpen && contractId && (
        <UpdateModal open={updateModalOpen} setOpen={setUpdateModalOpen} id={contractId} />
      )}
    </div>
  )
}

export default ContractsPage
