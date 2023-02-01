import React from 'react'

export const DocNavbar = () => {
  return (
    
        <div className="flex-shrink-0 p-3 bg-white" width="280px;">
            <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
            <span className="fs-5 fw-semibold">Documentation</span>
            </a>
            <ul className="list-unstyled ps-0">
            <li className="mb-1">
                <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                Home
                </button>
                <div className="collapse" id="home-collapse">
                <ul className="btn-toggle-nav fw-normal pb-1 small">
                    <li><a href="#presentation" className="link-dark d-inline-flex text-decoration-none rounded">Presentation</a></li>
                    <li><a href="#updates" className="link-dark d-inline-flex text-decoration-none rounded">Updates</a></li>
                </ul>
                </div>
            </li>
            <li className="mb-1">
                <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
                API References
                </button>
                <div className="collapse" id="dashboard-collapse">
                <ul className="btn-toggle-nav fw-normal pb-1 small">
                    <li><a href="#current" className="link-dark d-inline-flex text-decoration-none rounded">Current Weather</a></li> 
                    <li><a href="#specific" className="link-dark d-inline-flex text-decoration-none rounded">Specific Datasets</a></li> 
                    <li><a href="#general" className="link-dark d-inline-flex text-decoration-none rounded">General Datasets</a></li>  
                    <li><a href="#windrose" className="link-dark d-inline-flex text-decoration-none rounded">Wind Rose</a></li>                     
                </ul>
                </div>
            </li>             
            </ul>
        </div>    
    
  )
}
