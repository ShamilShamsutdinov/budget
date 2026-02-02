import { useRef, useState } from "react";
import { Modal } from "../../../components/UI/Modal";
import { getViewTransactionRoute } from "../../../lib/routes";
import { Link } from "react-router-dom";
import {
  AddTransactionForm,
  type TransactionFormData,
} from "../../../components/Forms/AddTransactionForm";
import { trpc } from "../../../lib/trpc";
import { getCategoryLabel, getTypeLabel } from "../../../utils/translate";
import { format } from "date-fns/format";
import { formatDateForInput } from "../../../utils/date";
import type { TrpcRouterOutput } from "@budget/backend/src/router";
import { useMe } from "../../../lib/ctx";
import InfiniteScroll from 'react-infinite-scroller'

export const AllTransactionsPage = () => {
  const me = useMe();

  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.getTransactions.useInfiniteQuery(
      {
        limit: 2,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor
        },
      }
  )

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
      type: transaction.type as "income" | "expense",
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

  if (isLoading) {
    return <div>Loading...</div>;
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

  const allTransactions = data.pages.flatMap((page) => page.transactions);

  return (
    <>
      <header className="header">
        <div>
          <h1>Все транзакции</h1>
          <div className="transactions-count">
            Всего {allTransactions.length} транзакции
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
          <h2>Последние транзакции</h2>
          <div className="filters">
            <button className="filter-btn active">Все</button>
            <button className="filter-btn">Доходы</button>
            <button className="filter-btn">Расходы</button>
          </div>
        </div>
        <div className="transactions-list" ref={scrollContainerRef}>
          <InfiniteScroll
            pageStart={0}
            threshold={267}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage()
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
            {allTransactions.map((transaction) => (
              <div key={transaction.id}>
                <Link
                  className={`transaction-item ${transaction.type === "income" ? "income-item" : "expense-item"}`}
                  to={getViewTransactionRoute({ id: transaction.id })}
                >
                  <div className="transaction-icon">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <div className="transaction-info">
                    <h4>
                      {getCategoryLabel(transaction.category, transaction.type)}
                    </h4>
                    <p>{getTypeLabel(transaction.type)}</p>
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
            ))}
          </InfiniteScroll>
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
