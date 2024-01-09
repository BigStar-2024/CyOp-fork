import { useState, useEffect, useCallback } from 'react';
import { useAudio } from 'react-awesome-audio';
import {
  UniswapPair,
  ETH,
  TradeDirection,
  UniswapPairSettings,
  UniswapVersion,
  TradeContext,
} from '@cyop/simple-uniswap-sdk';
import { toast } from 'react-toastify';
import { exchangeTokenList } from 'helpers/exchange-data';
import { useWeb3 } from 'shared/hooks';
import addresses from 'shared/addresses';
import TokenInput from './exchange/token-input';
import TokensSelector from './exchange/tokens-selector';
import SlippageInput from './exchange/slippage-input';

const sndAction = require('assets/audio/action.mp3').default;

export const ExchangeLeftPanel = () => {
  const {
    wallet,
    walletAddress,
    chainId,
    connected,
    handleConnect,
    switchNetwork,
  } = useWeb3();
  const { play } = useAudio({
    src: sndAction,
  });

  // slippage amount
  const [selectSlippage, setSelectSlippage] = useState(false);
  const [slippagePercent, setSlippagePercent] = useState(0.1);

  // set token type
  const [selectTokenType, setSelectTokenType] = useState<string | null>(null);
  const [tokenFrom, setTokenFrom] = useState<string | null>('eth');
  const [tokenTo, setTokenTo] = useState<string | null>('cyop');

  // send, receive amount
  const [sendAmount, setSendAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  // exchange data
  const [exchangeInfo, setExchangeInfo] = useState<any>(null);
  const [exchangeInfoError, setExchangeInfoError] = useState<any>(null);
  const [priceInfo, setPriceInfo] = useState<any>(null);
  const [fetchingExchangeInfo, setFetchingExchangeInfo] =
    useState<boolean>(false);

  // button type
  const [processing, setProcessing] = useState<boolean>(false);
  const [insufficient, setInsufficient] = useState<boolean>(false);
  const [tradeTx, setTradeTx] = useState<any>(null);

  const onClickEnter = async () => {
    if (tradeTx && wallet) {
      try {
        setProcessing(true);
        console.log(tradeTx);
        if (tradeTx.approvalTransaction) {
          const approved = await wallet.sendTransaction(
            tradeTx.approvalTransaction
          );
          console.log('approved txHash', approved.hash);
          const approvedReceipt = await approved.wait();
          console.log(approvedReceipt);
        }
        const tradeTransaction = await wallet.sendTransaction(
          tradeTx.transaction
        );
        console.log('trade txHash', tradeTransaction.hash);
        const tradeReceipt = await tradeTransaction.wait();
        console.log('trade receipt', tradeReceipt);
        tradeTx.destroy();
        toast.success('Swap successfull');
        setTradeTx(null);
        setSendAmount('');
        setReceiveAmount('');
        setExchangeInfo(null);
        setPriceInfo(null);
      } catch (e) {
        toast.error('Something went wrong');
        console.log(e);
      } finally {
        setProcessing(false);
      }
    }
    play();
  };

  const onClickConnect = () => {
    handleConnect();
  };

  const saveSlippage = (percent: number) => {
    setSlippagePercent(percent);
    setSelectSlippage(false);
  };

  const onCloseSetToken = () => {
    setSelectTokenType(null);
  };

  const onSetNewToken = (tokenSymbol: string, tokenType: string) => {
    if (tokenType === 'from') {
      if (tokenFrom !== tokenSymbol) {
        setTokenFrom(tokenSymbol);
      }
      if (tokenSymbol === tokenTo) {
        setTokenTo(null);
      }
    }
    if (tokenType === 'to') {
      if (tokenTo !== tokenSymbol) {
        setTokenTo(tokenSymbol);
      }
      if (tokenSymbol === tokenFrom) {
        setTokenFrom(null);
      }
    }
    setSendAmount('');
    setReceiveAmount('');
    setExchangeInfo(null);
    setSelectTokenType(null);
  };

  // update exchange rate values
  const updateExchangeValues = useCallback(
    (amount, slippagePercent, tradeType = TradeDirection.input) => {
      (async () => {
        try {
          setExchangeInfoError(null);
          setFetchingExchangeInfo(true);
          if (tokenFrom === 'cyop') {
            if (slippagePercent < 13) {
              setSlippagePercent(13);
              return;
            }
          }
          if (tokenFrom && tokenTo) {
            // get from token
            const tokenFromItem = exchangeTokenList.find(
              (token) => token.symbol === tokenFrom
            );
            const tokenToItem = exchangeTokenList.find(
              (token) => token.symbol === tokenTo
            );
            if (tokenFromItem && tokenToItem) {
              let fromTokenContractAddress, toTokenContractAddress;
              if (
                tokenFromItem.symbol === 'eth' ||
                tokenFromItem.symbol === 'weth'
              ) {
                fromTokenContractAddress = ETH.info(
                  Number(addresses.networkID)
                ).contractAddress;
              } else {
                fromTokenContractAddress = tokenFromItem.address;
              }
              if (
                tokenToItem.symbol === 'eth' ||
                tokenToItem.symbol === 'weth'
              ) {
                toTokenContractAddress = ETH.info(
                  Number(addresses.networkID)
                ).contractAddress;
              } else {
                toTokenContractAddress = tokenToItem.address;
              }
              if (
                fromTokenContractAddress &&
                toTokenContractAddress &&
                walletAddress
              ) {
                const uniswapPair = new UniswapPair({
                  fromTokenContractAddress,
                  toTokenContractAddress,
                  fromTrasferFee: tokenFromItem.symbol === 'cyop',
                  ethereumAddress: walletAddress,
                  ethereumProvider: wallet,
                  chainId: Number(addresses.networkID),
                  providerUrl: addresses.rpcURL,
                  settings: new UniswapPairSettings({
                    slippage: slippagePercent / 100,
                    deadlineMinutes: 20,
                    uniswapVersions: [UniswapVersion.v2, UniswapVersion.v3],
                  }),
                });
                const uniswapPairFactory = await uniswapPair.createFactory();
                if (parseFloat(amount) > 0) {
                  if (tradeType === TradeDirection.input) {
                    const trade = await uniswapPairFactory.trade(amount);
                    // TODO: look in to how to calculate price impact for the trade
                    // const priceImpact =
                    //   (Number(trade.minAmountConvertQuote) -
                    //     Number(trade.expectedConvertQuote)) /
                    //   Number(trade.minAmountConvertQuote);
                    setExchangeInfo({
                      // expectedInput: amount,
                      expectedOutput: trade.expectedConvertQuote,
                      priceImpact: false,
                      amountOutMin: trade.minAmountConvertQuote,
                    });
                    setFetchingExchangeInfo(false);
                    if (!trade.fromBalance.hasEnough) {
                      setInsufficient(true);
                    } else {
                      setInsufficient(false);
                    }
                    setTradeTx(trade);
                    trade.quoteChanged$.subscribe((value: TradeContext) => {
                      console.log('quote changed', value);
                      setTradeTx(trade);
                    });
                  } else {
                    const trade = await uniswapPairFactory.trade(
                      amount,
                      TradeDirection.output
                    );
                    setFetchingExchangeInfo(false);
                    if (!trade.fromBalance.hasEnough) {
                      setInsufficient(true);
                    } else {
                      setInsufficient(false);
                    }
                    setTradeTx(trade);
                    trade.quoteChanged$.subscribe((value: TradeContext) => {
                      console.log('quote changed', value);
                      setTradeTx(trade);
                    });
                    setExchangeInfo({
                      // expectedOutput: amount,
                      expectedInput: trade.expectedConvertQuote,
                      priceImpact: false,
                      amountInMax: trade.maximumSent,
                    });
                  }
                }
              }
            }
          }
        } catch (e) {
          console.log(e);
          setExchangeInfoError(e);
          setFetchingExchangeInfo(false);
        }
      })();
    },
    [tokenFrom, tokenTo, wallet, walletAddress]
  );

  useEffect(() => {
    // switch to layer 1 networkId
    if (chainId !== addresses.networkID) {
      switchNetwork(addresses.networkID);
    }
  }, [chainId, switchNetwork]);

  useEffect(() => {
    if (sendAmount) {
      updateExchangeValues(sendAmount, slippagePercent, TradeDirection.input);
    }
  }, [sendAmount, slippagePercent, updateExchangeValues]);

  useEffect(() => {
    if (receiveAmount) {
      updateExchangeValues(
        receiveAmount,
        slippagePercent,
        TradeDirection.output
      );
    }
  }, [receiveAmount, slippagePercent, updateExchangeValues]);

  return (
    <div className="flex-1">
      {!selectSlippage && !selectTokenType && (
        <>
          <div style={{ borderBottom: '3px solid #05CCB2' }}>
            <div className="btn-slippage ps-2">
              <span
                className="pointer"
                onClick={() => {
                  setSelectSlippage(true);
                }}
              >
                Slippage: {slippagePercent}% ▼
              </span>
            </div>
            <TokenInput
              label="send"
              initialDisplayValue={exchangeInfo?.expectedInput}
              initialValue={sendAmount}
              token={tokenFrom}
              onChangeAmount={(value: any) => {
                setSendAmount(value);
              }}
              openTokenSelector={() => {
                setSelectTokenType('from');
              }}
            />
          </div>
          <TokenInput
            label="receive"
            initialDisplayValue={exchangeInfo?.expectedOutput}
            initialValue={receiveAmount}
            token={tokenTo}
            onChangeAmount={(value: any) => {
              setReceiveAmount(value);
            }}
            openTokenSelector={() => {
              setSelectTokenType('to');
            }}
          />
          {(!connected || chainId !== addresses.networkID) && (
            <div className="button-label" onClick={onClickConnect}>
              connect wallet
            </div>
          )}
          {connected && chainId === addresses.networkID && processing && (
            <div className="button-label" style={{ opacity: '0.5' }}>
              <i
                className="fa fa-repeat fa-spin"
                aria-hidden="true"
                style={{ fontSize: '15px' }}
              ></i>
              &nbsp;processing
            </div>
          )}
          {connected && chainId === addresses.networkID && !processing && (
            <>
              {!fetchingExchangeInfo && !insufficient && (
                <div className="button-label" onClick={onClickEnter}>
                  enter
                </div>
              )}
              {fetchingExchangeInfo && (
                <div className="button-label" style={{ opacity: '0.5' }}>
                  <i
                    className="fa fa-repeat fa-spin"
                    aria-hidden="true"
                    style={{ fontSize: '15px' }}
                  ></i>
                  &nbsp;
                  <span className="text-small">
                    Fetching Exchange Information
                  </span>
                </div>
              )}
              {insufficient && (
                <div className="button-label" style={{ background: '#FF00A0' }}>
                  Insufficient balance
                </div>
              )}
            </>
          )}
          <div>
            {!fetchingExchangeInfo && priceInfo && (
              <>
                <span className="pt-2 ps-2 text-desc text-small">
                  1 {tokenFrom} = {priceInfo.midPrice} {tokenTo}
                </span>
              </>
            )}
            {/* {fetchingExchangeInfo && (
              <>
                <Loading />{' '}
                <span className="text-small">
                  Fetching exchange informations
                </span>
              </>
            )} */}
            {exchangeInfoError && (
              <div className="text-danger">{exchangeInfoError.message}</div>
            )}
            {!fetchingExchangeInfo && exchangeInfo && (
              <>
                {exchangeInfo.expectedOutput && (
                  <>
                    <div className="pt-2 ps-2">Expected Output:</div>
                    <div className="text-desc pt-1 ps-2">
                      {exchangeInfo.expectedOutput}
                    </div>
                  </>
                )}
                {exchangeInfo.expectedInput && (
                  <>
                    <div className="pt-2 ps-2">Expected Input:</div>
                    <div className="text-desc pt-1 ps-2">
                      {exchangeInfo.expectedInput}
                    </div>
                  </>
                )}
                {exchangeInfo.amountOutMin && (
                  <>
                    <div className="pt-2 ps-2">
                      Minimum received after slippage
                    </div>
                    <div className="text-desc pt-1 ps-2">
                      {exchangeInfo.amountOutMin}
                    </div>
                  </>
                )}
                {exchangeInfo.priceImpact && (
                  <>
                    <div className="pt-2 ps-2">Price Impact:</div>
                    <div className="text-desc pt-1 ps-2">
                      {exchangeInfo.priceImpact}%
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
      {selectSlippage && (
        <SlippageInput
          slippagePercent={slippagePercent}
          saveSlippage={saveSlippage}
          setSelectSlippage={setSelectSlippage}
        />
      )}
      {(selectTokenType === 'from' || selectTokenType === 'to') && (
        <TokensSelector
          tokenFrom={tokenFrom}
          tokenTo={tokenTo}
          selectTokenType={selectTokenType}
          onCloseSetToken={onCloseSetToken}
          onSetNewToken={onSetNewToken}
        />
      )}
    </div>
  );
};

export default ExchangeLeftPanel;
