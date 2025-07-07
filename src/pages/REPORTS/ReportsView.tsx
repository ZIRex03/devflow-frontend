import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { getAllProjects, getReportsByProject } from '@/features/slice/projects/projectsSlice';
import { ROUTES } from '@/routes/routes';
import { FaFilePdf } from "react-icons/fa";

import './ReportsView.scss'
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

const ReportsView = () => {
  const dispatch = useAppDispatch();
  const [selectedProject, setSelectedProject] = useState('');
  const {projectsList} = useAppSelector(({projects}) => projects);
  const { reportsList, reportsLoading } = useAppSelector(({projects}) => projects);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(getReportsByProject(selectedProject));
    }
  }, [selectedProject, dispatch]);

    const handleDownload = async (reportPath:string, reportName:string) => {
        try {
            // Добавляем параметры к URL (filename и возможные другие)
            const downloadUrl = `${BASE_URL}/download-report?filename=${encodeURIComponent(reportPath)}`;
            
            const response = await axios({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            });

            // Проверяем, что ответ содержит данные
            if (!response.data) {
            throw new Error('Пустой ответ от сервера');
            }

            // Определяем MIME-тип из заголовков или используем стандартный для PDF
            const mimeType = response.headers['content-type'] || 'application/pdf';
            
            // Создаем URL для blob с правильным MIME-типом
            const blob = new Blob([response.data], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            
            // Создаем временный элемент <a> для скачивания
            const link = document.createElement('a');
            link.href = url;
            
            // Извлекаем имя файла из заголовков или используем переданное
            const contentDisposition = response.headers['content-disposition'];
            let filename = reportName || 'report.pdf';
            
            if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            // Удаляем элемент и освобождаем память
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
            
            // Более информативное сообщение об ошибке
            let errorMessage = 'Не удалось скачать файл';
            if (error.response) {
            if (error.response.status === 404) {
                errorMessage = 'Файл не найден на сервере';
            } else if (error.response.status === 500) {
                errorMessage = 'Ошибка сервера при попытке скачать файл';
            }
            }
            
            alert(errorMessage);
        }
    };

  return (
    <div className='reportsview'>
      <Link className='back-button' to={ROUTES.REPORTS}>
        Назад
      </Link>

      <p className="reportsview-title">Просмотр отчетов</p>

      <div className="project-selector">
        <select 
          value={selectedProject} 
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Выберите проект</option>
          {projectsList?.map(project => (
            <option key={project.id} value={project.id}>
              {project.name} {/* Предполагая, что у проекта есть поле name */}
            </option>
          ))}
        </select>
      </div>

      {reportsLoading && <p>Загрузка отчетов...</p>}

      <div className="reports-list">
        {reportsList.length > 0 ? (
          <ul>
            {reportsList.map(report => (
              <li key={report.id} className="report-item">
                <div className="report-icon">
                  <FaFilePdf className='pdf-icon'/>
                </div>
                <div className="report-info">
                  <span className="report-name">{report.report_name}</span>
                  <span className="report-date">
                    {new Date(report.create_date).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={() => handleDownload(report.report_path, report.report_name)}
                  className="download-button"
                >
                  Скачать
                </button>
              </li>
            ))}
          </ul>
        ) : (
          selectedProject && !reportsLoading && <p>Нет отчетов для выбранного проекта</p>
        )}
      </div>
    </div>
  );
};

export default ReportsView;