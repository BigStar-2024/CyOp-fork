import { FC } from 'react';


export const SearchPanel:FC = () => {

  return (
    <div className="co-searchbar px-2 d-flex align-items-center mx-1" id='search-bar'>
      <div className="me-1">search</div>
      <div className="co-search-field-wrapper">
        <input className="co-search-field" />
      </div>
      <div className="ms-auto pointer">
        [filter]
      </div>
    </div>
  );
};

export default SearchPanel;