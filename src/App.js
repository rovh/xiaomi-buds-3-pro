import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col } from 'react-bootstrap';
import Use_Three_js from './Three-js-code';
import { Button, Offcanvas, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';


function App() {

  Use_Three_js(false)

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // useEffect(() => {document.body.style.cursor = 'pointer'})
  

  return (   
    <>  

    <Button id= 'bt' size='sm' variant="outline-secondary" onMouseEnter={handleShow}>
        Hover
    </Button>

      <Offcanvas show={show} onHide={handleClose} >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Xiaomi Redmi Buds 3 Pro
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Information
        </Offcanvas.Body>
      </Offcanvas>


      <canvas id="c1"></canvas>

    </>
        )
    }
    
    export default App;
    