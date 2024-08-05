import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css'; // Import your custom CSS

const Home = () => {
  return (
    <div className="home-page d-flex align-items-center">
      <Container>
        <Row className="justify-content-center align-items-center row-container">
          <Col md={6}>
            <div className="content">
              <h1>Welcome to Spend Insight</h1>
              <p>Your financial tracker and budgeting companion</p>
            </div>
          </Col>
          <Col md={6}>
            <img
              src="/images/undraw_savings.svg"
              alt="Illustration"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
