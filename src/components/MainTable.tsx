import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import salaryData from '../salaryData.json';
import './MainTable.css';

interface SalaryData {
  work_year: number;
  job_title: string;
  salary_in_usd: number;
}

interface YearlyData {
  totalJobs: number;
  totalSalary: number;
}

interface TableData {
  year: number;
  totalJobs: number;
  averageSalary: number;
}

interface JobTitleData {
  job_title: string;
  job_count: number;
}

const MainTable: React.FC = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [jobTitleData, setJobTitleData] = useState<JobTitleData[]>([]);

  useEffect(() => {
    const processData = () => {
      const yearlyData: { [key: number]: YearlyData } = {};

     
      
      salaryData.forEach((item: SalaryData) => {
        const { work_year, salary_in_usd } = item;
        if (!yearlyData[work_year]) {
          yearlyData[work_year] = { totalJobs: 0, totalSalary: 0 };
        }
        yearlyData[work_year].totalJobs += 1;
        yearlyData[work_year].totalSalary += salary_in_usd;
      });

   
      
      const tableData: TableData[] = Object.keys(yearlyData).map((yearStr) => {
        const year = parseInt(yearStr, 10); 
        const { totalJobs, totalSalary } = yearlyData[year];
        return {
          year: year,
          totalJobs: totalJobs,
          averageSalary: totalSalary / totalJobs,
        };
      });

      setData(tableData);
    };

    processData();
  }, []);

  const handleRowClick = (record: TableData) => {
    const filteredData = salaryData.filter(item => item.work_year === record.year);
    const jobCount: { [key: string]: number } = {};

    filteredData.forEach(item => {
      if (!jobCount[item.job_title]) {
        jobCount[item.job_title] = 0;
      }
      jobCount[item.job_title] += 1;
    });

    const jobTitleData: JobTitleData[] = Object.keys(jobCount).map(jobTitle => ({
      job_title: jobTitle,
      job_count: jobCount[jobTitle],
    }));

    setSelectedYear(record.year);
    setJobTitleData(jobTitleData);
  };

  const columns = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a: TableData, b: TableData) => a.year - b.year,
    },
    {
      title: 'Number of Total Jobs',
      dataIndex: 'totalJobs',
      key: 'totalJobs',
      sorter: (a: TableData, b: TableData) => a.totalJobs - b.totalJobs,
    },
    {
      title: 'Average Salary (USD)',
      dataIndex: 'averageSalary',
      key: 'averageSalary',
      sorter: (a: TableData, b: TableData) => a.averageSalary - b.averageSalary,
    },
  ];

  const jobTitleColumns = [
    {
      title: 'Job Title',
      dataIndex: 'job_title',
      key: 'job_title',
    },
    {
      title: 'Number of Jobs',
      dataIndex: 'job_count',
      key: 'job_count',
    },
  ];

  return (
    <div>
      <h1>Main Table</h1>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="year"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <h1>Job Trends</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalJobs" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      {selectedYear && (
        <>
          <h1>Job Titles in {selectedYear}</h1>
          <Table
            columns={jobTitleColumns}
            dataSource={jobTitleData}
            rowKey="job_title"
          />
        </>
      )}
    </div>
  );
};

export default MainTable;
