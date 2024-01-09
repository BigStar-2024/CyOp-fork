import { useState } from 'react';

function SlippageSelector({
  slippagePercent,
  saveSlippage,
  setSelectSlippage,
}: any) {
  const [tempSlippagePercent, setTempSlippagePercent] =
    useState(slippagePercent);
  return (
    <>
      <div className="d-flex justify-content-between pt-2">
        <span className="text-desc ps-2">set slippage</span>
        <span
          className="pe-2 pt-1 pointer"
          style={{ fontSize: '12px' }}
          onClick={() => {
            setSelectSlippage(false);
          }}
        >
          close
        </span>
      </div>
      <div className="d-flex justify-content-between py-2">
        <input
          min={0}
          type="number"
          className="text-desc ps-2 stake-txt-input"
          onChange={(event) => setTempSlippagePercent(event.target.value)}
          value={tempSlippagePercent}
        />
      </div>
      <div
        className="button-label"
        onClick={() => {
          saveSlippage(tempSlippagePercent);
        }}
      >
        enter
      </div>
    </>
  );
}

export default SlippageSelector;
