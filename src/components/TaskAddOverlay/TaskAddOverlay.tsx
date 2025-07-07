import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { createTask, getProjectTasks, toggleTaskAdd } from '@/features/slice/tasks/tasksSlice';
import { LuImageDown } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { Calendar } from 'primereact/calendar';
import { addLocale } from "primereact/api";
import "./TaskAddOverlay.scss";
import { Nullable } from "primereact/ts-helpers";

type Props = {
    status: string,
};



const TaskAddOverlay = ({status}: Props) => {
  const dispatch = useAppDispatch();
  const { activeProject } = useAppSelector(({ projects }) => projects);
  const {isLoading} = useAppSelector(({tasks}) => tasks)
  const currentDate = new Date();
  const inputFile = useRef<HTMLInputElement | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Средний',
  });

  const formatLocalDate = (date: Date | null): string => {
    if (!date) return '';
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement |  HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

  const handleInputFile = () => {
    if (!inputFile.current?.files?.length) return;
    
    const file = inputFile.current.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeProject?.id) {
      setError('Не выбран проект');
      return;
    }

    if (!formData.name || !startDate || !endDate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (startDate > endDate) {
      setError('Дата окончания не может быть раньше даты начала');
      return;
    }

    try {
      await dispatch(createTask({
        ...formData,
        status,
        start_date: formatLocalDate(startDate),
        end_date: formatLocalDate(endDate),
        project_id: activeProject.id,
        image: selectedFile || undefined
      })).unwrap();

      dispatch(getProjectTasks(activeProject.id))

      dispatch(toggleTaskAdd(false))
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
      setError('Произошла ошибка при создании задачи');
    }
  };

  addLocale('ru', {
    firstDayOfWeek: 1,
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  return (
    <div
        className="taskaddoverlay"
    >
      <p className="taskaddoverlay-title">Добавление задачи</p>
      <IoMdClose className="close-icon" onClick={() => dispatch(toggleTaskAdd(false))} />

      <form className="taskaddoverlay__form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="taskaddoverlay__form-header">
          <div className="taskaddoverlay__form-inputgroup">
            <label htmlFor="name">Название задачи*</label>
            <input
              type="text"
              name="name"
              placeholder="Введите название задачи"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="taskaddoverlay__form-selectgroup">
            <label htmlFor="priority">Приоритет задачи*</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
            >
              <option value="Высокий">Высокий</option>
              <option value="Средний">Средний</option>
              <option value="Низкий">Низкий</option>
            </select>
          </div>

          <div className="taskaddoverlay__form-selectgroup">
            <label htmlFor="startDate">Дата начала*</label>
            <Calendar
              locale="ru"
              className="calendar start"
              minDate={currentDate}
              dateFormat="dd/mm/yy"
              showIcon
              value={startDate}
              onChange={(e) => setStartDate(e.value)}
              required
            />
          </div>

          <div className="taskaddoverlay__form-selectgroup">
            <label htmlFor="endDate">Дата конца*</label>
            <Calendar
              locale="ru"
              className="calendar start"
              minDate={startDate || currentDate}
              dateFormat="dd/mm/yy"
              showIcon
              value={endDate}
              onChange={(e) => setEndDate(e.value)}
              required
              
            />
          </div>
        </div>

        <div className="taskaddoverlay__form-inputgroup">
          <label htmlFor="description">Описание задачи</label>
          <textarea
            name="description"
            placeholder="Введите описание задачи"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="taskaddoverlay__form-imagebox">
          <input
            ref={inputFile}
            type="file"
            name="image"
            id="taskimage"
            accept="image/*"
            onChange={handleInputFile}
          />

          {isImage && previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Предпросмотр" />
            </div>
          )}

          <label className="taskimage-label" htmlFor="taskimage">
            <LuImageDown className="image-icon"/>
            <p>Загрузить изображение</p>
          </label>
        </div>

        <div className="taskaddoverlay__form-actions">
          <button
            type="button"
            className="taskaddoverlay__form-actions-button cancel"
            onClick={() => dispatch(toggleTaskAdd(false))}
            disabled={isLoading}
          >
            отмена
          </button>

          <button
            type="submit"
            className="taskaddoverlay__form-actions-button accept"
            disabled={isLoading}
          >
            {isLoading? 'создание...' : 'создать'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskAddOverlay;