import React, { Component } from "react";
import "./customers.css";

class Customers extends Component {
  constructor() {
    super(); //because this is embedded to a parent component
    this.state = {
      customers: []
    };
  }
  componentDidMount() {
    fetch("users/api/customers")
      .then(res => res.json())
      .then(customers =>
        this.setState({ customers }, () =>
          console.log("customer successfully", customers)
        )
      );
  }
  render() {
    return (
      <div>
        <h2>customers</h2>
        <ul>
          {this.state.customers.map(customer => (
            <li key={customer.id}>
              {customer.firstname} {customer.lastname}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Customers;
