import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './BarchartAdmin.scss';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchTopUsersByTasks } from '@/features/slice/user/userSlice';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarchartAdmin = () => {
    const dispatch = useAppDispatch();
    const { topUsers} = useAppSelector(({users}) => users);

    useEffect(() => {
        if(!topUsers){
            dispatch(fetchTopUsersByTasks(10)); 
        }
    }, [dispatch, topUsers]);

    const data = {
        labels: topUsers?.map(user => user.full_name),
        datasets: [{
        label: 'Количество задач',
        data: topUsers?.map(user => user.task_count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        }]
    };
    
    if(topUsers){
        return (
            <div className='dashboard__content-users-chart'>
                <h3>Топ-10 загруженных пользователей</h3>
                <Bar
                    className='dashboard__content-users-chart-bar'
                    data={data}
                    options={
                    {
                        responsive: true,
                        indexAxis: window.innerWidth < 1000 ? 'y' : 'x',
                        plugins: {
                            legend: { display: false }, 
                        },
                        scales: {
                            y: { beginAtZero: true },
                            x: { 
                                ticks: { 
                                    font: { 
                                        size: window.innerWidth < 800 ? 10 : 12 
                                    } 
                                } 
                            }
                        }
                    }}
                />
            </div>
        );
    }
    else{
        return(
            <div>Не удалось загрузить данные</div>
        )
    }

    
};

export default BarchartAdmin;