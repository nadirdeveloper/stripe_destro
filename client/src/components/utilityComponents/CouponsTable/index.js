import React from 'react';
import { Table, Input, Button, Space, Popconfirm, notification } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditFilled, DeleteOutlined } from '@ant-design/icons';
// import { AuthContext } from "../../../context/Auth";
// import ETModal from '../ETModal';
import Axios from 'axios';

class CouponTable extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    Transactions: [],
    loading: true,
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
          text
        ),
  });
   openNotificationWithIcon = (type, message, title) => {
    notification[type]({
      message: title,
      description: message,
      duration: 2,
    });
  };
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
deleteCoupon = (e) =>{
Axios.post("http://localhost:5000/api/users/deleteCoupon",{
  couponId: e.key
}).then((res)=>{
  this.openNotificationWithIcon('success','You have successfully deleted the coupon','ERROR')
  this.props.handleData();
}).catch((e)=>{
  this.openNotificationWithIcon('error','Something Went Wrong','ERROR')
})
}
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  // static contextType = AuthContext;
  render() {

    const columns = [
      {
        title: 'SNO',
        dataIndex: 'sno',
        key: 'sno',
        ...this.getColumnSearchProps('sno'),
      },
      {
        title: 'Coupon Name',
        dataIndex: 'couponName',
        key: 'couponName',
        // width: '100%',
        ...this.getColumnSearchProps('couponName'),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        ...this.getColumnSearchProps('currency'),
        // width: '100%',

      },
      {
        title: 'Percent OFF',
        dataIndex: 'percentOff',
        key: 'percentOff',
        ...this.getColumnSearchProps('percentOff'),
        // width: '100%',
      },
      {
        title: 'duration',
        dataIndex: 'duration',
        key: 'duration',
        ...this.getColumnSearchProps('duration'),
        // width: '200%',
      
      },
      {
        title: 'duration In Months',
        dataIndex: 'durationInMonths',
        key: 'durationInMonths',
        ...this.getColumnSearchProps('durationInMonths'),
      },
      {
        render: (e) => (<div style={{display:"flex"}}><Button onClick={() => this.openNotificationWithIcon('info',"You can not edit coupon because it is not editable",'INFO')}><EditFilled /></Button>
          <Popconfirm
            placement="bottomRight"
            title="Are you sure?"
            onConfirm={() => this.deleteCoupon(e)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button><DeleteOutlined /></Button>
          </Popconfirm></div>)
      }
    ];
    let loading = true;
    const  userTransactions  = this.props.userCouponsData;
   
    let transactions = [];
    if (userTransactions.length > 0) {
      userTransactions.forEach((transaction, index) => {
        transactions.push({
          key: transaction.id,
          sno: index + 1,
          couponName: transaction.name,
          currency: transaction.currency,
          percentOff: transaction.percent_off,
          duration: transaction.duration,
          durationInMonths: transaction.duration_in_months,
        })
      });
      loading = false;
    }else{
      loading = false;
    }

    return (
      <>
        <Table
          loading={loading}
          pagination={10}
          columns={columns}
          dataSource={transactions}
          />
        {/* <ETModal ref={e => this.etmodal = e} /> */}
      </>

    )
  }
}
export default CouponTable;