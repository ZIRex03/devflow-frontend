
import React from 'react'
import { TbReportSearch } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";

import './Reports.scss'
import { ROUTES } from '@/routes/routes';
import { Link } from 'react-router-dom';


const Reports = () => {
  return (
    <div className='reports'>
      <p className="reports-title">Отчеты</p>

      <div className="reports__box">
        <div className="reports__options">

          <Link to={ROUTES.REPORTS_VIEW}>
            <button className='reports__options-button'>
              <TbReportSearch className='button-icon'/>
              Просмотреть все отчеты
            </button>
          </Link>

          <Link to={ROUTES.REPORTS_GENERATE}>
            <button className='reports__options-button add'>
              <FaPlus className='button-icon'/>
              Сгенерировать отчет
            </button>
          </Link>

          
        </div>
      </div>

      
    </div>
  )
}

export default Reports