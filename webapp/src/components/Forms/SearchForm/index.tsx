import { Input } from "../../UI/Input";
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useDebounceValue } from 'usehooks-ts';

interface SearchFormProps {
    onSearchChange?: (search?: string, resetCursor?: boolean) => void;
    initialSearch?: string;
}

export const SearchForm = ({ 
    onSearchChange, 
    initialSearch = '', 
}: SearchFormProps) => {
    
    const formik = useFormik({
        initialValues: {
            search: initialSearch,
        },
        onSubmit: (values) => {
            if (onSearchChange) {
                onSearchChange(
                    values.search.trim() || undefined,
                    true
                );
            }
        },
    });

    // Используем useDebounceValue из usehooks-ts
    const [debouncedSearch] = useDebounceValue(formik.values.search, 1000);

    // Отправляем изменения при debounce с проверкой на пустую строку
    useEffect(() => {
        // Не вызываем onSearchChange, если значение не изменилось
        if (onSearchChange && debouncedSearch !== initialSearch) {
            onSearchChange(
                debouncedSearch.trim() || undefined,
                true
            );
        }
    }, [debouncedSearch, onSearchChange, initialSearch]);

    // Очистка формы
    const handleClear = () => {
        formik.setFieldValue('search', '');
        if (onSearchChange) {
            onSearchChange(undefined, true);
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
            }}
            className="search-form"
        >
            <div className="search-form-wrapper">
                <Input
                    name="search"
                    id="search"
                    type="text"
                    placeholder="Поиск транзакций"
                    formik={formik}
                />
                {formik.values.search && (
                    <button
                        type="button"
                        className="clear-button"
                        onClick={handleClear}
                        aria-label="Очистить поиск"
                    >
                        ✕
                    </button>
                )}
            </div>
        </form>
    );
};