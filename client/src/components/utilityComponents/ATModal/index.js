import React from 'react'; 
import { Modal, Button, Form, Input, Select, Spin, notification } from 'antd';
import Axios from 'axios';
class ATModal extends React.Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
    loading: false,
    buttonLoading: false,
  };
  setData = (e) => {
    setTimeout(() => {
      this.setState({ data: e, loading: false })
    }, 1000);
  }
  showModal = (e) => {
    this.setState({
      visible: true,
      loading: true,  
    });
  };
  openNotificationWithIcon = (type, message, title) => {
    notification[type]({
      message: title,
      description: message,
      duration: 2,
    });
  };
  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 1000);
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      loading: false,
      data:null,
      buttonLoading: false,
    });
  };
  addCoupon =  (e) => {
    this.setState({ buttonLoading: true }, () => {
      const {couponName,currency,percentOff,duration,durationInMonths,} = e;
      var addDoc = {
        couponName,
        currency,
        percentOff,
        duration,
        durationInMonths,
      }
      Axios.post('/api/users/createCoupon',{addDoc}).then((response)=>{
        if(!response.data.error){
          this.openNotificationWithIcon("success","You have successfully create a coupon","SUCCESS");
          this.handleCancel();
          this.props.handleData();
        }else{
          this.openNotificationWithIcon("error","Something Went Wrong","ERROR");
        }
      }).catch((err)=>{
        this.openNotificationWithIcon("error","Something Went Wrong","ERROR");
      })
    })

  }
  render() {
    const { visible, confirmLoading, loading, data,buttonLoading, } = this.state;

    return (
      <>
        <Modal
          title="Coupon Add"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          width="90%"
          centered={true}
          footer={loading && null}
        >
          {
            false ? <div style={{ height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}><Spin size="large" /></div> : (
              <Form
                className="login-form"
                initialValues={
                  data && {
                  remember: false,
                  description: '',
                  amount: '',
                  transactionType: ''
                }}
                style={{ width: "100%", height: "400px" }}
                onFinish={(e) => this.addCoupon(e)}
              >
                <h1 style={{ textAlign: "center", }} >ADD Coupon</h1>
                <Form.Item
                  name="couponName"

                  rules={[
                    {
                      required: true,
                      message: 'Please input your Coupon Name!',
                    }
                  ]}
                >
                  <Input placeholder="Coupon Name" />
                </Form.Item>
               
                <Form.Item name="currency" rules={[{ required: true, message: 'Please provide the currency.' }]} >
                  <Select
                    placeholder="Select a Currency"
                    allowClear
                  >
                    <Select.Option value="PKR">PKR</Select.Option>
                    <Select.Option value="USD">USD</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="duration" rules={[{ required: true, message: 'Please provide the duration.' }]} >
                  <Select
                    placeholder="Select a Duration"
                    allowClear
                  >
                    <Select.Option value="repeating">repeating</Select.Option>
                    {/* <Select.Option value="forever">forever</Select.Option> */}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="percentOff"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your percent Off',
                    },

                  ]}
                >
                  <Input placeholder="Percent OFF" type="number" />
                </Form.Item>
               
                <Form.Item
                  name="durationInMonths"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your coupon duration in months',
                    },

                  ]}
                >
                  <Input placeholder="Duration In Months" type="number" />
                </Form.Item>

                <div style={{ textAlign: "center" }}>
                  <Button type="primary" htmlType="submit" className="login-form-button" loading={buttonLoading}>
                   Add Coupon
            </Button>
                </div>
              </Form>
            )
          }

        </Modal>
      </>
    );
  }
}

export default ATModal