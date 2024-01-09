import React from 'react';
import { exchangeTokenList } from 'helpers/exchange-data';

function TokensSelector({
  // tokenTo,
  // tokenFrom,
  selectTokenType,
  onCloseSetToken,
  onSetNewToken,
}: any) {
  return (
    <>
      <div className="co-searchbar px-2 d-flex align-items-center">
        <div className="me-1">Select Token</div>
        {/* <div className="me-1">search</div>
        <div className="co-search-field-wrapper">
          <input className="co-search-field" />
        </div> */}
        <div className="ms-auto pointer" onClick={onCloseSetToken}>
          close
        </div>
      </div>

      {exchangeTokenList.map((token, index) => (
        <React.Fragment key={`token-${index}`}>
          {/* {(selectTokenType === 'from'
            ? token.symbol !== tokenTo
            : token.symbol !== tokenFrom) && ( */}
          <div
            className="co-token-link px-2"
            onClick={() => onSetNewToken(token.symbol, selectTokenType)}
            key={`navlink-${token}`}
          >
            {token.symbol}
          </div>
          {/* )} */}
        </React.Fragment>
      ))}
    </>
  );
}

export default TokensSelector;
