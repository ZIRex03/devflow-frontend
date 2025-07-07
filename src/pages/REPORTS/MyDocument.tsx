
import 'react-datepicker/dist/react-datepicker.css';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import './Reports.scss';

import RegularFont from '../../fonts/PPPangramSans-CompactRegular.otf'
import LOGO_ICON from '@icons/devflow-logo-icon.png'
import { translateStatus } from '@/utils/constants';

Font.register({
  family: 'Pangram',
  src: RegularFont
});

// Стили для PDF (react-pdf)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Pangram',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  projectTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  periodInfo: {
    fontSize: 12,
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
  },
  table: {
    Display: 'table',
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    width: '25%',
    padding: 8,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
    fontSize: 12,
  },
  tableCell: {
    width: '25%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    fontSize: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    width: '30%',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

type Project = {
  id: number;
  name: string;
};

type Task = {
  id: number;
  name: string;
  status: string;
  priority: string;
  start_date: Date,
  // добавьте другие поля по необходимости
};

type Extra_Services = {
  extra_service_name: string
}

type Technologies = {
  name: string
}
const MyDocument = ({ 
  project, 
  tasks,
  extraServicesList,
  technologiesList, 
  startDate, 
  endDate 
}: { 
  project: Project, 
  tasks: Task[],
  extraServicesList: Extra_Services[],
  technologiesList: Technologies[],
  startDate: Date, 
  endDate: Date 
}) => {
  // Рассчитываем статистику
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const newTasks = tasks.filter(task => {
    const taskDate = new Date(task.start_date);
    return taskDate >= startDate && taskDate <= endDate;
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Шапка отчета */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src={LOGO_ICON} style={{ width: 30, height: 40 }} />
            <Text style={styles.logoText}>DevFlow</Text>
          </View>
          <View>
            <Text style={styles.periodInfo}>
              ОТЧЕТНЫЙ ПЕРИОД: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Название проекта */}
        <View style={styles.section}>
          <Text style={styles.reportTitle}>ОТЧЕТ О СТАТУСЕ ПРОЕКТА:</Text>
          <Text style={styles.projectTitle}>{project.name}</Text>
        </View>

        {/* Общая информация */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ОБЩАЯ ИНФОРМАЦИЯ</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text>Прогресс выполнения:</Text>
              <Text style={styles.statValue}>{progress}%</Text>
            </View>
            <View style={styles.statItem}>
              <Text>Всего задач:</Text>
              <Text style={styles.statValue}>{totalTasks}</Text>
            </View>
            <View style={styles.statItem}>
              <Text>Новые задачи:</Text>
              <Text style={styles.statValue}>{newTasks.length}</Text>
            </View>
          </View>
        </View>

        {/* Технологии проекта */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ИСПОЛЬЗУЕМЫЕ ТЕХНОЛОГИИ</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={{...styles.tableHeader, width: '100%'}}>Технология</Text>
            </View>
            {technologiesList.map((tech, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={{...styles.tableCell, width: '100%'}}>
                  • {tech.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        

        {/* Список задач */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>СПИСОК ЗАДАЧ</Text>
          <View style={styles.table}>
            {/* Заголовки таблицы */}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Задача</Text>
              <Text style={styles.tableHeader}>Статус</Text>
              <Text style={styles.tableHeader}>Приоритет</Text>
              <Text style={styles.tableHeader}>Дата начала</Text>
            </View>
            
            {/* Строки с задачами */}
            {tasks.map((task) => (
              <View style={styles.tableRow} key={task.id}>
                <Text style={styles.tableCell}>{task.name}</Text>
                <Text style={styles.tableCell}>{translateStatus.get(task.status)}</Text>
                <Text style={styles.tableCell}>{task.priority}</Text>
                <Text style={styles.tableCell}>{new Date(task.start_date).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Дополнительные услуги */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={{...styles.tableHeader, width: '100%'}}>Услуга</Text>
            </View>
            {extraServicesList.map((service, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={{...styles.tableCell, width: '100%'}}>
                  • {service.extra_service_name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument