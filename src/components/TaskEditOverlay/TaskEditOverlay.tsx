import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { LuImageDown } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { Calendar } from 'primereact/calendar';
import { addLocale } from "primereact/api";
import "./TaskEditOverlay.scss";
import { Nullable } from "primereact/ts-helpers";
import { getProjectTasks, updateTask } from "@/features/slice/tasks/tasksSlice";

type Props = {
    id: number,
    name: string,
    description: string,
    status: string,
    priority: string,
    start_date: Date,
    end_date: Date,
    closeForm: () => void
};

const TaskEditOverlay = ({id, name, description, status, priority, start_date, end_date, closeForm}: Props) => {
  const dispatch = useAppDispatch();
  const currentDate = new Date();
  const inputFile = useRef<HTMLInputElement | null>(null);

  const {activeProject} = useAppSelector(({projects}) => projects)
  
  const [formData, setFormData] = useState({
    name,
    description,
    priority,
    status
  });

  const defaultStartDate = new Date(start_date);
  const defaultEndDate = new Date(end_date);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Nullable<Date>>(defaultStartDate);
  const [endDate, setEndDate] = useState<Nullable<Date>>(defaultEndDate);
  const [error, setError] = useState('');

    const formatLocalDate = (date: Date | null): string => {
        if (!date) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    if (!formData.name || !startDate || !endDate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (startDate > endDate) {
      setError('Дата окончания не может быть раньше даты начала');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('start_date', formatLocalDate(startDate));
      formDataToSend.append('end_date', formatLocalDate(endDate));
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      await dispatch(updateTask({
        id,
        formData: formDataToSend
      })).unwrap();

      dispatch(getProjectTasks(activeProject.id))
      closeForm();

    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
      setError('Произошла ошибка при обновлении задачи');
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
    <div className="taskeditoverlay">
      <p className="taskeditoverlay-title">Редактирование задачи</p>
      <IoMdClose className="close-icon" onClick={closeForm} />

      <form className="taskeditoverlay__form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}


          <div className="taskeditoverlay__form-inputgroup">
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

          <div className="taskeditoverlay__form-selectgroup">
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

          <div className="taskeditoverlay__form-selectgroup">
            <label htmlFor="status">Статус задачи*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="todo">В планах</option>
              <option value="progress">В работе</option>
              <option value="review">На проверке</option>
              <option value="done">Завершено</option>
            </select>
          </div>

          <div className="taskeditoverlay__form-selectgroup">
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

          <div className="taskeditoverlay__form-selectgroup">
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


        <div className="taskeditoverlay__form-inputgroup">
          <label htmlFor="description">Описание задачи</label>
          <textarea
            name="description"
            placeholder="Введите описание задачи"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="taskeditoverlay__form-imagebox">
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

        <div className="taskeditoverlay__form-actions">
          <button
            type="button"
            className="taskeditoverlay__form-actions-button cancel"
            onClick={closeForm}
          >
            отмена
          </button>

          <button
            type="submit"
            className="taskeditoverlay__form-actions-button accept"
          >
            сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskEditOverlay;