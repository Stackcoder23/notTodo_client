import React from "react";
import Home from "./Home";

export default function Outline() {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            textAlign: 'center',
            overflow: 'hidden',
            display: 'flex',
            backgroundColor: '#add8e6'
          }}>
            <div style={{ margin: '50px', height: '90%', borderRadius: '25px', position: 'relative', width: '100%', backgroundColor: '#ffffff', overflow: 'auto' }}>
              <Home/>
            </div>
          </div>
    )
}