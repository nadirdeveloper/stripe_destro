import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import loginImg from "../../login.svg";
import "./style.scss";
class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      // this.props.history.push("/dashboard");
      window.location.href = '/dashboard';

    }
  }

  componentWillReceiveProps(nextProps) {
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="base-container" ref={this.props.containerRef}>
      <div className="header">Register</div>
      <div className="content">
          <div className="image">
              <img src={loginImg} alt="Register"/>
          </div>
          <div className="form">
              <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text" placeholder="Username" />
              </div>
              <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email" placeholder="Email" />
              </div>
              <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                   placeholder="Password" />
              </div>
              <div className="form-group">
                  <label htmlFor="password">Confirm Password</label>
                  <input 
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                   placeholder="Confirm Password" />
              </div>
          </div>
      </div>
      <div className="footer">
          <button type="button" onClick={this.onSubmit} className="btn">Register</button>
      </div>
  </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
