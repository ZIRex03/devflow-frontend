import React from 'react'

import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

import './DoughnutAdmin.scss'
import { useAppSelector } from '@/hooks/reduxHooks'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
)

function DoughnutAdmin() {

    const {projectsList} = useAppSelector(({projects}) => projects)

    const activeProjects = projectsList?.filter((project) => (
        project.status === 'active'
    )) || []

    const holdProjects = projectsList?.filter((project) => (
        project.status === 'hold'
    )) || []

    const doneProjects = projectsList?.filter((project) => (
        project.status === 'done'
    )) || []

    const data = {
        labels: [
            'Активные',
            'На паузе',
            'Завершенные',
        ],
        datasets: [{
            data: [
                activeProjects.length,
                holdProjects.length,
                doneProjects.length
            ],
            backgroundColor: [
                '#008EE4',
                '#D5EDFF',
                '#FEE274'
            ],
            spacing: 8,
            hoverOffset: 5
        }]
    }
  return (
    <div className='dashboard__content-projects-chart'>
        <Doughnut className='dashboard__content-projects-chart-doughnut'
            data={data}
            options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins:{
                        legend:{
                            display: true
                        }
                    }
                }
            }
        />
    </div>
  )
}

export default DoughnutAdmin