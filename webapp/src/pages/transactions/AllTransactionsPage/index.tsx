import { useCallback, useRef, useState } from "react";
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

export const AllTransactionsPage = () => {
  const me = useMe();

  // Состояние для параметров поиска
  const [searchParams, setSearchParams] = useState<{
    search?: string;
    cursor?: number;
    limit: number;
  }>({
    limit: 20, 
  });

  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.getTransactions.useInfiniteQuery(
      {
        search: searchParams.search,
        limit: searchParams.limit,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // Сбросить данные при изменении поиска
        keepPreviousData: false,
      }
    );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionFormData | null>(null);

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

  // Функции фильтров по типу транзакций
  const [activeFilter, setActiveFilter] = useState<'all' | 'Доход' | 'Расход'>('all');

  // Фильтрация транзакций по типу на клиенте
  const allTransactions = data?.pages.flatMap((page) => page.transactions) || [];
  
  const filteredTransactions = allTransactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Доход') return transaction.type === 'Доход';
    if (activeFilter === 'Расход') return transaction.type === 'Расход';
    return true;
  });

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
            Всего {filteredTransactions.length} транзакции
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
            <div className="stat-amount">85,430 ₽</div>
            <div className="stat-change">+12% с прошлого месяца</div>
          </div>
        </div>

        <div className="stat-card expense-stat">
          <div className="stat-icon">
            <i className="fas fa-arrow-up"></i>
          </div>
          <div className="stat-info">
            <h3>Общий расход</h3>
            <div className="stat-amount">42,150 ₽</div>
            <div className="stat-change">+5% с прошлого месяца</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="stat-info">
            <h3>Баланс</h3>
            <div className="stat-amount">43,280 ₽</div>
            <div className="stat-change">Текущий месяц</div>
          </div>
        </div>
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
                      <button className="action-btn delete" title="Удалить">
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

      <div className="chart-container">
        <div className="chart-header">
          <h2>Статистика доходов и расходов</h2>
          <div className="chart-period">
            <button className="period-btn active">Неделя</button>
            <button className="period-btn">Месяц</button>
            <button className="period-btn">Год</button>
          </div>
        </div>
        <div className="chart-placeholder">
          <div>
            <i className="fas fa-chart-line"></i>
            <div>Здесь будет график доходов и расходов</div>
          </div>
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


