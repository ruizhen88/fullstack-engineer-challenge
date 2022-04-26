import { useCallback, useEffect, useState } from "react";
import axios from "../../axiosConfig";
import Header from "./Header";
import Pagination from "./Pagination";
import Search from "./Search";
import Table from "./Table";

const STATUS_TO_DISPLAY = ["ACTIVE", "PENDING"];

const Policies = () => {
  const [rowData, setRowData] = useState<Policy[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const fetchPolicies = useCallback(async (params) => {
    let data = { totalPage: 1, policies: [] };
    try {
      const response = await axios.get("/policies", { params });
      data = response.data;
    } catch (err: any) {
      setError(true);
    }
    return data;
  }, []);

  const handleDataToDisplay = (data: Policy[]) => {
    const dataToDisplay = data.filter((item: Policy) =>
      STATUS_TO_DISPLAY.includes(item.status)
    );
    setRowData(dataToDisplay);
  };

  const getTableData = useCallback(
    async (params = {}) => {
      setLoading(true);
      const data = await fetchPolicies(params);
      // Disabling status filter for now to get correct paginated result
      // handleDataToDisplay(data);
      setTotalPage(data.totalPage);
      setRowData(data.policies);
      setLoading(false);
    },
    [fetchPolicies]
  );

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  const handlePageChange = (page: number) => {
    getTableData({ page });
  };

  return (
    <div className="w-full p-8">
      <Header />
      <Search onSearch={getTableData} onClear={getTableData} />
      <Table rowData={rowData} isLoading={isLoading} hasError={hasError} />
      <Pagination onPageClick={handlePageChange} totalPage={totalPage} />
    </div>
  );
};

export default Policies;
