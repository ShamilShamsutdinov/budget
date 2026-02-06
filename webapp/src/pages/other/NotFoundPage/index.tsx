import notFoundImage from '../../../assets/images/404-not-found.png';

export const NotFoundPage = () => {
  

  return (
     <div className="not-found">
        <h1 className="not-found__title">Ошибка 404</h1>
        <span className="not-found__subtitle">Страница не найдена</span>
        <img className='not-found__img' src={notFoundImage} alt="Страница не найдена" />
     </div>
    
  )
}