// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
// import { trpc } from '../../../lib/trpc';
// import { Loader } from '../../UI/Loader';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const CATEGORY_COLORS: Record<string, string> = {
//   // Доходы
//   Зарплата: '#4CAF50',      
//   Фриланс: '#2196F3',       
//   Инвестиции: '#9C27B0',   
//   Перевод: '#FF9800',       
  
//   // Расходы
//   Еда: '#FF5722',           
//   Транспорт: '#FFC107',     
//   Развлечения: '#E91E63',  
//   Отпуск: '#00BCD4',       
//   Здоровье: '#F44336',     
//   'Фаст-фуд': '#FF6B6B',   
//   Авто: '#795548',          
//   Кредит: '#607D8B',      
//   ЖКХ: '#3F51B5',         
  
//   // Общие
//   Другое: '#9E9E9E',      
//   default: '#607D8B',     
// };

// const buildChartData = (groupedData: Record<string, number>, label: string) => {
//   const categories = Object.keys(groupedData);
//   const values = Object.values(groupedData);
//   const backgroundColors = categories.map((cat) => CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default);

//   return {
//     labels: categories,
//     datasets: [
//       {
//         label,
//         data: values,
//         backgroundColor: backgroundColors,
//         borderColor: 'white',
//         borderWidth: 2,
//       },
//     ],
//   };
// };

// const options: ChartOptions<'pie'> = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: { 
//       position: 'bottom', 
//       labels: { 
//         boxWidth: 12, 
//         padding: 15 
//       } 
//     },
//     tooltip: {
//       callbacks: {
//         label: (context) => {
//           const label = context.label || '';
//           const value = context.raw as number;
//           const total = context.dataset.data.reduce<number>((a, b) => (a as number) + (b as number), 0) as number;
//           const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
//           return `${label}: ${value.toLocaleString()} ₽ (${percentage}%)`;
//         },
//       },
//     },
//   },
// };

// type CategoryChartsProps = {
//   period?: 'week' | 'month' | 'year' | 'all';
// };

// export const CategoryCharts = ({ period = 'month' }: CategoryChartsProps) => {
//   const { data, isLoading } = trpc.getTransactionCategoryStats.useQuery(
//     { period },
//     { keepPreviousData: true }  
//   );

//   const renderCategoryTable = (data: Record<string, number>) => {
//     const total = Object.values(data).reduce((sum, val) => sum + val, 0);
//     const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

//     return (
//       <div className="category-table">
//         {sortedEntries.map(([category, amount]) => {
//           const percentage = ((amount / total) * 100).toFixed(1);
//           return (
//             <div key={category} className="category-row">
//               <div className="category-info">
//                 <span 
//                   className="category-color" 
//                   style={{ backgroundColor: CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default }}
//                 />
//                 <span className="category-name">{category}</span>
//               </div>
//               <div className="category-amount">
//                 <span className="amount">{amount.toLocaleString()} ₽</span>
//                 <span className="percentage">{percentage}%</span>
//               </div>
//             </div>
//           );
//         })}
//         <div className="category-total">
//           <span>Итого:</span>
//           <span>{total.toLocaleString()} ₽</span>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="charts-grid">
//         <div className="chart-card">
//           <Loader type="section" />
//         </div>
//         <div className="chart-card">
//           <Loader type="section" />
//         </div>
//       </div>
//     );
//   }

//   const hasIncome = data?.income && Object.keys(data.income).length > 0;
//   const hasExpense = data?.expense && Object.keys(data.expense).length > 0;

//   const incomeChartData = hasIncome ? buildChartData(data.income, 'Доходы') : null;
//   const expenseChartData = hasExpense ? buildChartData(data.expense, 'Расходы') : null;

//   return (
//     <div className="charts-grid">
//       <div className="chart-card">
//         <h3>Доходы по категориям</h3>
//         <div className="chart-wrapper">
//           {hasIncome ? (
//             <Pie data={incomeChartData!} options={options} />
//           ) : (
//             <div className="no-data">Нет доходов</div>
//           )}
//         </div>
//         {hasIncome && renderCategoryTable(data.income)}
//       </div>
      
//       <div className="chart-card">
//         <h3>Расходы по категориям</h3>
//         <div className="chart-wrapper">
//           {hasExpense ? (
//             <Pie data={expenseChartData!} options={options} />
//           ) : (
//             <div className="no-data">Нет расходов</div>
//           )}
//         </div>
//         {hasExpense && renderCategoryTable(data.expense)}
//       </div>
//     </div>
//   );
// };

// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
// import { trpc } from '../../../lib/trpc';
// import { Loader } from '../../UI/Loader'; 

// ChartJS.register(ArcElement, Tooltip, Legend);


// const CATEGORY_COLORS: Record<string, string> = {
//   // Доходы
//   Зарплата: '#4CAF50',      
//   Фриланс: '#2196F3',       
//   Инвестиции: '#9C27B0',   
//   Перевод: '#FF9800',       
  
//   // Расходы
//   Еда: '#FF5722',           
//   Транспорт: '#FFC107',     
//   Развлечения: '#E91E63',  
//   Отпуск: '#00BCD4',       
//   Здоровье: '#F44336',     
//   'Фаст-фуд': '#FF6B6B',   
//   Авто: '#795548',          
//   Кредит: '#607D8B',      
//   ЖКХ: '#3F51B5',         
  
//   // Общие
//   Другое: '#9E9E9E',      
//   default: '#607D8B',     
// };

// const buildChartData = (groupedData: Record<string, number>, label: string) => {
//   const categories = Object.keys(groupedData);
//   const values = Object.values(groupedData);
//   const backgroundColors = categories.map((cat) => CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default);

//   return {
//     labels: categories,
//     datasets: [
//       {
//         label,
//         data: values,
//         backgroundColor: backgroundColors,
//         borderColor: 'white',
//         borderWidth: 2,
//       },
//     ],
//   };
// };

// const options: ChartOptions<'pie'> = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } },
//     tooltip: {
//       callbacks: {
//         label: (context) => {
//           const label = context.label || '';
//           const value = context.raw as number;
//           const total = context.dataset.data.reduce<number>((a, b) => (a as number) + (b as number), 0) as number;
//           const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
//           return `${label}: ${value.toLocaleString()} ₽ (${percentage}%)`;
//         },
//       },
//     },
//   },
// };

// type CategoryChartsProps = {
//   period?: 'week' | 'month' | 'all';
//   year?: number;
//   month?: number;
// };

// export const CategoryCharts = ({ period = 'month', year, month }: CategoryChartsProps) => {
//   const { data, isLoading } = trpc.getTransactionCategoryStats.useQuery(
//     { period, year, month },
//     { keepPreviousData: true }
//   );

//   if (isLoading) {
//     return (
//       <div className="charts-grid">
//         <div className="chart-card"><Loader type="section" /></div>
//         <div className="chart-card"><Loader type="section" /></div>
//       </div>
//     );
//   }

//   const hasIncome = data?.income && Object.keys(data.income).length > 0;
//   const hasExpense = data?.expense && Object.keys(data.expense).length > 0;

//   const incomeChartData = hasIncome ? buildChartData(data.income, 'Доходы') : null;
//   const expenseChartData = hasExpense ? buildChartData(data.expense, 'Расходы') : null;

//   return (
//     <div className="charts-grid">
//       <div className="chart-card">
//         <h3>Доходы по категориям</h3>
//         <div className="chart-wrapper">
//           {hasIncome ? <Pie data={incomeChartData!} options={options} /> : <div className="no-data">Нет доходов</div>}
//         </div>
//       </div>
//       <div className="chart-card">
//         <h3>Расходы по категориям</h3>
//         <div className="chart-wrapper">
//           {hasExpense ? <Pie data={expenseChartData!} options={options} /> : <div className="no-data">Нет расходов</div>}
//         </div>
//       </div>
//     </div>
//   );
// };

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
import { trpc } from '../../../lib/trpc';
import { Loader } from '../../UI/Loader';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS: Record<string, string> = {
  // Доходы
  Зарплата: '#4CAF50',
  Фриланс: '#2196F3',
  Инвестиции: '#9C27B0',
  Перевод: '#FF9800',
  // Расходы
  Еда: '#FF5722',
  Транспорт: '#FFC107',
  Развлечения: '#E91E63',
  Отпуск: '#00BCD4',
  Здоровье: '#F44336',
  'Фаст-фуд': '#FF6B6B',
  Авто: '#795548',
  Кредит: '#607D8B',
  ЖКХ: '#3F51B5',
  // Общие
  Другое: '#9E9E9E',
  default: '#607D8B',
};

const buildChartData = (groupedData: Record<string, number>, label: string) => {
  const categories = Object.keys(groupedData);
  const values = Object.values(groupedData);
  const backgroundColors = categories.map((cat) => CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default);

  return {
    labels: categories,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: backgroundColors,
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
};

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.raw as number;
          const total = context.dataset.data.reduce<number>((a, b) => (a as number) + (b as number), 0) as number;
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          return `${label}: ${value.toLocaleString()} ₽ (${percentage}%)`;
        },
      },
    },
  },
};

type CategoryChartsProps = {
  period?: 'week' | 'month' | 'all';
  year?: number;
  month?: number;
};

export const CategoryCharts = ({ period = 'month', year, month }: CategoryChartsProps) => {
  const { data, isLoading } = trpc.getTransactionCategoryStats.useQuery(
    { period, year, month },
    { keepPreviousData: true }
  );

  const renderCategoryTable = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

    return (
      <div className="category-table">
        {sortedEntries.map(([category, amount]) => {
          const percentage = ((amount / total) * 100).toFixed(1);
          return (
            <div key={category} className="category-row">
              <div className="category-info">
                <span
                  className="category-color"
                  style={{ backgroundColor: CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default }}
                />
                <span className="category-name">{category}</span>
              </div>
              <div className="category-amount">
                <span className="amount">{amount.toLocaleString()} ₽</span>
                <span className="percentage">{percentage}%</span>
              </div>
            </div>
          );
        })}
        <div className="category-total">
          <span>Итого:</span>
          <span>{total.toLocaleString()} ₽</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="charts-grid">
        <div className="chart-card"><Loader type="section" /></div>
        <div className="chart-card"><Loader type="section" /></div>
      </div>
    );
  }

  const hasIncome = data?.income && Object.keys(data.income).length > 0;
  const hasExpense = data?.expense && Object.keys(data.expense).length > 0;

  const incomeChartData = hasIncome ? buildChartData(data.income, 'Доходы') : null;
  const expenseChartData = hasExpense ? buildChartData(data.expense, 'Расходы') : null;

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Доходы по категориям</h3>
        <div className="chart-wrapper">
          {hasIncome ? <Pie data={incomeChartData!} options={options} /> : <div className="no-data">Нет доходов</div>}
        </div>
        {hasIncome && renderCategoryTable(data.income)}
      </div>
      <div className="chart-card">
        <h3>Расходы по категориям</h3>
        <div className="chart-wrapper">
          {hasExpense ? <Pie data={expenseChartData!} options={options} /> : <div className="no-data">Нет расходов</div>}
        </div>
        {hasExpense && renderCategoryTable(data.expense)}
      </div>
    </div>
  );
};