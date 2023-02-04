import React from 'react'

export const Footer = () => {
  return (
    <>
    <br></br>
    <div className='container-fluid navbar-expand-lg' style={{backgroundColor:'DimGray'}}>
      <footer className="d-flex flex-wrap justify-content-between align-items-center">
          <p className="col-md-4 mb-0 text-muted">© 2023 LNA | OPD</p>

          <a href="/" className="col-md-4 d-flex align-items-center justify-content-center">
          <img src={require('../assets/logo_lna_pb.png')} alt="Logo" width="30" height="40" className="d-inline-block align-text-top"/>
          </a>

          <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item"><a href="/docs" className="nav-link px-2 text-muted"></a></li>
          </ul>
      </footer>
    </div>
    </>  
  )
}
