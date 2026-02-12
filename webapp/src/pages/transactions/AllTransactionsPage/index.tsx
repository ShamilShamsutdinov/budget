import { useCallback, useRef, useState, useMemo } from "react";
import { Modal } from "../../../components/UI/Modal";
import { getViewTransactionRoute } from "../../../lib/routes";
import { Link } from "react-router-dom";
import {
  AddTransactionForm,
  type TransactionFormData,
} from "../../../components/Forms/AddTransactionForm";
import { trpc } from "../../../lib/trpc";
import { format } from "date-fns/format";
import { formatDateForInput } from "../../../utils/date";
import type { TrpcRouterOutput } from "@budget/backend/src/router";
import { useMe } from "../../../lib/ctx";
import InfiniteScroll from 'react-infinite-scroller'
import { Loader } from "../../../components/UI/Loader";
import { SearchForm } from "../../../components/Forms/SearchForm";
import { Select } from "../../../components/UI/Select";
import { CategoryCharts } from "../../../components/UI/Chart";

export const AllTransactionsPage = () => {
  const me = useMe();

  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');

  // Состояние для параметров поиска
  const [searchParams, setSearchParams] = useState<{
    search?: string;
    cursor?: number;
    limit: number;
  }>({
    limit: 20, 
  });

  // Запрос статистики за текущий и предыдущий месяц
  const { data: statsData, isLoading: statsLoading, error: statsError } = trpc.comparisonTransaction.useQuery({
    type: "",
    amount: 0,
    date: ""
  });
    

  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.getTransactions.useInfiniteQuery(
      {
        search: searchParams.search,
        limit: searchParams.limit,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: false,
      }
    );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionFormData | null>(null);

  const utils = trpc.useUtils();
  const deleteMutation = trpc.deleteTransaction.useMutation({
    onSuccess: () => {
      utils.getTransactions.invalidate();
      utils.comparisonTransaction.invalidate();
      utils.getTransactionCategoryStats.invalidate();
    }
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  type TransactionFromAPI =
    TrpcRouterOutput["getTransactions"]["transactions"][0];

  const handleEditClick = (transaction: TransactionFromAPI) => {
    setEditingTransaction({
      id: transaction.id,
      type: transaction.type as "Доход" | "Расход",
      amount: transaction.amount,
      category: transaction.category,
      date: formatDateForInput(transaction.date),
      comment: transaction.comment || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
  };

  // Обработчик изменения поиска
  const handleSearchChange = useCallback((search?: string, resetCursor?: boolean) => {
    setSearchParams(prev => ({
      ...prev,
      search,
      cursor: resetCursor ? undefined : prev.cursor,
    }));
  }, []); 

  // Получаем уникальные годы из транзакций
  const allTransactions = data?.pages.flatMap((page) => page.transactions) || [];
  
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    allTransactions.forEach(transaction => {
      const year = format(transaction.date, 'yyyy');
      yearsSet.add(year);
    });
    
    const years = Array.from(yearsSet)
      .sort((a, b) => parseInt(b) - parseInt(a)) 
      .map(year => ({ value: year, label: `${year} год` }));
    
    return [{ value: 'all', label: 'Все годы' }, ...years];
  }, [allTransactions]);

  const months = [
    { value: 'all', label: 'Все месяцы' },
    { value: '01', label: 'Январь' },
    { value: '02', label: 'Февраль' },
    { value: '03', label: 'Март' },
    { value: '04', label: 'Апрель' },
    { value: '05', label: 'Май' },
    { value: '06', label: 'Июнь' },
    { value: '07', label: 'Июль' },
    { value: '08', label: 'Август' },
    { value: '09', label: 'Сентябрь' },
    { value: '10', label: 'Октябрь' },
    { value: '11', label: 'Ноябрь' },
    { value: '12', label: 'Декабрь' }
  ];

  const [activeFilter, setActiveFilter] = useState<'all' | 'Доход' | 'Расход'>('all');

  // Сначала фильтруем по типу (доход/расход)
  const filteredByType = allTransactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Доход') return transaction.type === 'Доход';
    if (activeFilter === 'Расход') return transaction.type === 'Расход';
    return true;
  });

  // Затем фильтруем по году и месяцу
  const filteredTransactions = filteredByType.filter(transaction => {
    const transactionYear = format(transaction.date, 'yyyy');
    const transactionMonth = format(transaction.date, 'MM');
    
    // Проверяем год
    if (selectedYear !== 'all' && transactionYear !== selectedYear) {
      return false;
    }
    
    // Проверяем месяц
    if (selectedMonth !== 'all' && transactionMonth !== selectedMonth) {
      return false;
    }
    
    return true;
  });

  // Считаем статистику для отображения в хедере
  const totalTransactions = filteredTransactions.length;

  // Получаем название выбранного месяца для отображения
  const getFilterInfo = () => {
    const monthInfo = months.find(m => m.value === selectedMonth);
    const yearInfo = availableYears.find(y => y.value === selectedYear);
    
    if (selectedMonth === 'all' && selectedYear === 'all') {
      return '';
    }
    
    const parts = [];
    if (selectedMonth !== 'all') {
      parts.push(monthInfo?.label.toLowerCase());
    }
    if (selectedYear !== 'all') {
      parts.push(yearInfo?.label);
    }
    
    return ` за ${parts.join(' ')}`;
  };

  const hasActiveFilters = activeFilter !== 'all' || selectedYear !== 'all' || selectedMonth !== 'all';

  // Форматирование суммы в рубли
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Форматирование процента со знаком
  const formatPercent = (percent: number) => {
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent}%`;
  };

  if (isLoading) {
    return <Loader type="page"/>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  if (!me) {
    return (
      <div>
        <h1>Все транзакции</h1>
        <p>Пожалуйста, авторизуйтесь, чтобы видеть свои транзакции.</p>
      </div>
    );
  }

  return (
    <>
      <header className="header">
        <div>
          <h1>Все транзакции</h1>
          <div className="transactions-count">
            Всего {totalTransactions} транзакции
            {getFilterInfo()}
          </div>
        </div>
        <button
          disabled={!me?.id}
          className={`add-btn ${!me?.id ? "disabled" : ""}`}
          onClick={() => setIsAddModalOpen(true)}
        >
          <i className="fas fa-plus"></i>
          <span>Добавить транзакцию</span>
        </button>
      </header>

      <div className="stats-cards">
        <div className="stat-card income-stat">
          <div className="stat-icon">
            <i className="fas fa-arrow-down"></i>
          </div>
          <div className="stat-info">
            <h3>Общий доход</h3>
            {statsLoading ? (
              <Loader type="section" />
            ) : statsError ? (
              <div className="stat-error">Ошибка загрузки</div>
            ) : (
              <>
                <div className="stat-amount">
                  {formatCurrency(statsData?.current.income ?? 0)}
                </div>
                <div className="stat-change">
                  {statsData && (
                    <>
                      {formatPercent(statsData.changes.income.percent)}
                      {' '}с прошлого месяца
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="stat-card expense-stat">
          <div className="stat-icon">
            <i className="fas fa-arrow-up"></i>
          </div>
          <div className="stat-info">
            <h3>Общий расход</h3>
            {statsLoading ? (
              <Loader type="section" />
            ) : statsError ? (
              <div className="stat-error">Ошибка загрузки</div>
            ) : (
              <>
                <div className="stat-amount">
                  {formatCurrency(statsData?.current.expense ?? 0)}
                </div>
                <div className="stat-change">
                  {statsData && (
                    <>
                      {formatPercent(statsData.changes.expense.percent)}
                      {' '}с прошлого месяца
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="stat-info">
            <h3>Баланс</h3>
            {statsLoading ? (
              <Loader type="section" />
            ) : statsError ? (
              <div className="stat-error">Ошибка загрузки</div>
            ) : (
              <>
                <div className="stat-amount">
                  {formatCurrency(statsData?.current.balance ?? 0)}
                </div>
                <div className="stat-change">
                  {statsData?.period.current.label}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

       <div className="chart-container">
        <div className="chart-header">
          <h2>Статистика доходов и расходов</h2>
          <div className="chart-period">
            <button
              className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('week')}
            >
              Неделя
            </button>
            <button
              className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              Месяц
            </button>
            <button
              className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('year')}
            >
              Год
            </button>
            <button
              className={`period-btn ${selectedPeriod === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('all')}
            >
              Всё время
            </button>
          </div>
        </div>
        <CategoryCharts period={selectedPeriod} />
      </div>

      <div className="transactions-container">
        <div className="transactions-header">
          <div className="transactions-header-top">
            <h2>Последние транзакции</h2>
          </div>
          <div className="search-container">
            <div className="filters">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Все
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'Доход' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Доход')}
              >
                Доходы
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'Расход' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Расход')}
              >
                Расходы
              </button>
              <Select
                id="years"
                value={selectedYear}
                onChange={setSelectedYear}
                options={availableYears}
                placeholder="Все годы"
                className="year-select"
              />
              <Select
                id="months" 
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={months}
                placeholder="Все месяцы"
                className="month-select"
              />
            </div>
            <SearchForm 
              onSearchChange={handleSearchChange}
              initialSearch={searchParams.search}
            />
          </div>
        </div>
        <div className="transactions-list" ref={scrollContainerRef}>
          <InfiniteScroll
            pageStart={0}
            threshold={267}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage();
              }
            }}
            hasMore={hasNextPage}
            loader={
              <div className="loading-indicator" key="loader">
                Загрузка...
              </div>
            }
            getScrollParent={() => scrollContainerRef.current}
            useWindow={false}
          >
            {filteredTransactions.length === 0 ? (
              <div className="no-transactions">
                {searchParams.search ? (
                  <p>По запросу "{searchParams.search}" ничего не найдено</p>
                ) : hasActiveFilters ? (
                  <p>Нет транзакций по выбранным фильтрам</p>
                ) : (
                  <p>Транзакций пока нет</p>
                )}
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id}>
                  <Link
                    className={`transaction-item ${transaction.type === "Доход" ? "income-item" : "expense-item"}`}
                    to={getViewTransactionRoute({ id: transaction.id })}
                  >
                    <div className="transaction-icon">
                      <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="transaction-info">
                      <h4>
                        {(transaction.category)}
                      </h4>
                      <p>
                        {(transaction.type)}
                        {transaction.comment && ` (${transaction.comment})`}
                      </p>
                    </div>
                    <div className="transaction-date">
                      {format(transaction.date, "yyyy-MM-dd")}
                    </div>
                    <div className="transaction-amount">{transaction.amount}</div>
                    <div className="transaction-actions">
                      <button
                        className="action-btn edit"
                        title="Редактировать"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditClick(transaction);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn delete" 
                              title="Удалить"
                              onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  await deleteMutation.mutateAsync({ id: transaction.id });
                                  
                                }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </InfiniteScroll>
          {isFetchingNextPage && (
            <div className="loading-more">
              <Loader type="section" />
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddTransactionForm onSubmitSuccess={handleAddSuccess} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {editingTransaction && (
          <AddTransactionForm
            initialData={editingTransaction}
            onSubmitSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </>
  );
};




