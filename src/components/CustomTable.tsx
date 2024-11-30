import React, { SetStateAction } from 'react';
import { Table, TableColumnType } from 'antd';
import { ContractType } from '../types';

interface TableType {
    contracts: ContractType[] | undefined;
    rowKey: keyof ContractType;
    columns: TableColumnType<ContractType>[];
    loading: boolean;
    pagination: {
        pageSize: number;
        current: number;
        total: number | undefined;
    };
    setPage: React.Dispatch<SetStateAction<number>>;
    setPageSize: React.Dispatch<SetStateAction<number>>;
}

const CustomTable: React.FC<TableType> = ({ contracts, rowKey, columns, loading,pagination, setPage, setPageSize }) => {
    const handleTableChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        setPage(current);
        setPageSize(pageSize);
    };

    return (
        <>
            <Table<ContractType> onChange={handleTableChange} dataSource={contracts || []} rowKey={rowKey} pagination={pagination} loading={loading} columns={columns} size="large" />
        </>
    )
}

export default CustomTable;