import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import loginImg from "../../login.svg";
import "./style.scss";


class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      // this.props.history.push("/dashboard");
      window.location.href = '/dashboard';
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      window.location.href = '/dashboard';
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="base-container" ref={this.props.containerRef}>
      <div className="header">Login</div>
      <div className="content">
          <div className="image">
              <img src={loginImg} alt="Login"/>
          </div>
          <div className="form">
              <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email" placeholder="Username" />
              </div>
              <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input  
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password" placeholder="Password" />
              </div>
          </div>
      </div>
      <div className="footer">
          <button type="button" className="btn" onClick={this.onSubmit}>Login</button>
      </div>
  </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
