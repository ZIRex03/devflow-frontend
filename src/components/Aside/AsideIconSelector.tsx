import { MdOutlineDashboard } from "react-icons/md";
import { IoFolderOpenOutline } from "react-icons/io5";


const AsideIconSelector = (value: string) => {

  switch(value){

    case 'Дашборд':
        return <MdOutlineDashboard className='pages-icon'/>
    case 'Проекты':
        return <IoFolderOpenOutline className='pages-icon'/>
    default: return null
  }
}

export default AsideIconSelector