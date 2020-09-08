import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Axios from "axios";
import CouponTable from "../utilityComponents/CouponsTable";
import ATModal from "../utilityComponents/ATModal";

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      coupons: []
    }
  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  getAllData = async () => {
    const result = await Axios.post("http://localhost:5000/api/users/getAllCoupons");
    let coupons = result.data.coupons || [];
    console.log(coupons)
   this.setState({coupons});
  }
  async componentDidMount() {
    this.getAllData()
  }
  render() {
    const { user } = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                You are logged into a Stripe Coupon{" "}
                {/* <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏 */}
              </p>
            </h4>
            <button
              style={{
                width: "250px",
                borderRadius: "3px",
                letterSpacing: "1.0px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button><br />
            <button
              style={{
                width: "250px",
                borderRadius: "3px",
                letterSpacing: "1.0px",
                marginTop: "1rem"
              }}
              onClick={() => this.atmodal.showModal()}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
             Add Coupon
            </button>
          </div>
        </div>
        <CouponTable userCouponsData={this.state.coupons} handleData={this.getAllData} />
        <ATModal ref={e => this.atmodal = e} handleData={this.getAllData} />
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
