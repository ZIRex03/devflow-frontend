
import website from '@images/projects/website_2.png'
import mobile from '@images/projects/mobile_2.png'
import desktop from '@images/projects/desktop_2.png'
import webapp from '@images/projects/webapp_2.png'
import corporate from '@images/projects/corporate.png'

const ProjectsIconSelector = (type: string) => {
  
    switch(type){

        case('Веб-приложение'):
            return <img src={webapp} alt="Web-App" className='type-icon'/>  
        case('Мобильное приложение'):
            return <img src={mobile} alt="Mobile-App" className='type-icon'/>  
        case('Десктоп'):
            return <img src={desktop} alt="Destop-App" className='type-icon'/>  
        case('Веб-сайт'):
            return <img src={website} alt="Website" className='type-icon'/>  
        case('Корпоративная система'):
            return <img src={corporate} alt="Corporate" className='type-icon'/>  
        default: return null
    }
}

export default ProjectsIconSelector