import React, { useState, useEffect } from 'react';

import { PDFViewer, Font, pdf } from '@react-pdf/renderer';
import { getAllProjects, getProjectExtraService, getProjectTechnologies } from '@/features/slice/projects/projectsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { getProjectTasks } from '@/features/slice/tasks/tasksSlice';
import RegularFont from '../../fonts/PPPangramSans-CompactRegular.otf'
import MyDocument from './MyDocument';
import { uploadReport } from '@/features/slice/user/userSlice';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './GenerateReports.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';

// Типы для данных
type Project = {
  id: number;
  name: string;
};

Font.register({
  family: 'Pangram',
  src: RegularFont
});


const GenerateReports: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projectsList, projectExtraService, projectsTechnologies } = useAppSelector(({ projects }) => projects);
  const {currentUser} = useAppSelector(({users}) => users)
  const { tasksList } = useAppSelector(({ tasks }) => tasks);
  
  // Состояния
  const [startDate, setStartDate] = useState<Date>(getStartOfWeek(new Date()));
  const [endDate, setEndDate] = useState<Date>(getEndOfWeek(new Date()));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Функция для получения начала недели
  function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff));
  }

  // Функция для получения конца недели
  function getEndOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() + (day === 0 ? 0 : 7 - day); 
    return new Date(d.setDate(diff));
  }

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const project = projectsList?.find((p: Project) => p.id === parseInt(e.target.value));
    setSelectedProject(project || null);
    setShowPreview(false); // Сбрасываем состояние превью при смене проекта
  };

  // Загрузка проектов при монтировании
  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  // Загрузка задач при выборе проекта
  useEffect(() => {
    if (selectedProject) {
      dispatch(getProjectTasks(selectedProject.id))
      dispatch(getProjectTechnologies(selectedProject.id))
      dispatch(getProjectExtraService(selectedProject.id))
        .then(() => {
          // После успешной загрузки можно снова показать превью, если нужно
        })
        .catch(() => {
          setShowPreview(false);
        });
    } else {
      setShowPreview(false);
    }
  }, [selectedProject, dispatch]);

  // Генерация PDF
  const generatePDF = async (): Promise<void> => {
    if (!selectedProject) return;
    setShowPreview(true);
  };

  // В компоненте Reports добавим обработчик сохранения
    const handleSaveReport = async () => {
      if (!selectedProject || !currentUser) return;

      try {
        // Генерация PDF на основе компонента MyDocument
        const blob = await pdf(
          <MyDocument 
            project={selectedProject} 
            tasks={tasksList || []} 
            startDate={startDate} 
            endDate={endDate} 
          />
        ).toBlob();

        const file = new File([blob], `report_${selectedProject.name}_${Date.now()}.pdf`, {
          type: 'application/pdf'
        });

        const reportData = {
          report_name: `Отчет по проекту ${selectedProject.name}`,
          reportfile: file,
          created_user: currentUser.id,
          project_id: selectedProject.id
        };

        await dispatch(uploadReport(reportData)).unwrap();
        alert('Отчет успешно сохранен!');
        setSelectedProject(null)
      } catch (err) {
        console.error('Ошибка при сохранении отчета:', err);
        alert('Произошла ошибка при сохранении отчета');
      }
    };

  return (
    <div className="reports-container">

        <Link className='back-button' to={ROUTES.REPORTS}>
            Назад
        </Link>

        <p className='reports-title'>Генерация отчета</p>

      <div className="controls">
        <div className="select-group">
          <label>Проект:</label>
          <select
            value={selectedProject?.id || ''}
            onChange={handleProjectChange}
          >
            <option value="">Выберите проект</option>
            {projectsList && projectsList.map((project: Project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="date-range-group">
          <div className="date-picker">
            <label>Начало недели:</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setStartDate(date);
                }
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              className="date-input"
            />
          </div>
          <div className="date-picker">
            <label>Конец недели:</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setEndDate(date);
                }
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              className="date-input"
            />
          </div>
        </div>
      </div>

      <button
        onClick={generatePDF}
        disabled={!selectedProject}
        className="generate-button"
      >
        Сгенерировать отчет
      </button>

      {showPreview && selectedProject && tasksList && tasksList.length > 0 && (
        <div className="preview-section">
          <h2>Превью отчета</h2>
          <button
            className="save-button"
            onClick={handleSaveReport}
          >
            Отправить PDF в базу
          </button>
          <div className="pdf-preview-container">
            <PDFViewer className="pdf-viewer">
              <MyDocument 
                project={selectedProject} 
                tasks={tasksList || []}
                extraServicesList={projectExtraService}
                technologiesList={projectsTechnologies} 
                startDate={startDate} 
                endDate={endDate} 
              />
            </PDFViewer>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default GenerateReports;