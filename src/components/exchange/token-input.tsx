import { useEffect, useState } from 'react';
import addresses from 'shared/addresses';
import useDebounce from 'hooks/useDebounce';
import { toast } from 'react-toastify';
import { formatUnits, parseCommified, toFixedNoRounding } from 'helpers/utils';
import { exchangeTokenList } from 'helpers/exchange-data';
import { useContracts, useWeb3 } from 'shared/hooks';
import Loading from '../loading';
import { decimals } from "shared/constants";

function TokenInput({
  initialDisplayValue = '0.0',
  initialValue = '',
  token,
  onChangeAmount,
  openTokenSelector,
  label,
}: any) {
  const { balanceOf, balanceOfErc20 } = useContracts();
  const { walletAddress, getSetWalletBalance, walletBalance, chainId } =
    useWeb3();

  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balance, setBalance] = useState('0.0');
  // console.log(label, initialValue);
  const [amount, setAmount] = useState(initialValue);
  const [displayAmount, setDisplayAmount] = useState(initialDisplayValue);

  const selectedToken = exchangeTokenList.find(
    (tokenItem) => tokenItem.symbol === token
  );
  const debouncedInput: string = useDebounce<string>(amount, 500);
  const onChange = (value: string) => {
    if (isNaN(Number(value))) {
      return;
    }
    setDisplayAmount(value);
    setAmount(value);
  };

  // useEffect(() => {
  //   setAmount(initialValue);
  // }, [initialValue]);

  useEffect(() => {
    setDisplayAmount(initialDisplayValue);
  }, [initialDisplayValue]);

  useEffect(
    () => {
      if (isNaN(Number(debouncedInput))) {
        return;
      }
      if (debouncedInput) {
        onChangeAmount(debouncedInput);
      } else {
        onChangeAmount(debouncedInput);
      }
    },
    [debouncedInput] // eslint-disable-line
  );

  useEffect(() => {
    async function fetchData(showLoader = false) {
      if (selectedToken?.symbol) {
        try {
          if (showLoader) setBalanceLoading(true);
          switch (selectedToken.symbol) {
            default:
              break;
            case 'eth':
              const ethBalance = await getSetWalletBalance!();
              if (ethBalance) {
                setBalance(parseCommified(ethBalance).toFixed(4).toString());
              }
              break;
            case 'cyop':
              const cyopBalance = await balanceOf!('L1');
              if (cyopBalance) {
                setBalance(
                  parseCommified(formatUnits(cyopBalance, decimals.CyOp))
                    .toFixed(4)
                    .toString()
                );
              }
              break;
            case 'usdt':
              const usdtBalance = await balanceOfErc20!(
                addresses.USDT,
                walletAddress!,
                'L1'
              );
              if (usdtBalance) {
                setBalance(parseCommified(usdtBalance).toFixed(4).toString());
              }
              break;
            case 'usdc':
              const usdcBalance = await balanceOfErc20!(
                addresses.USDC,
                walletAddress!,
                'L1'
              );
              if (usdcBalance) {
                setBalance(parseCommified(usdcBalance).toFixed(4).toString());
              }
              break;
            case 'weth':
              const wethBalance = await balanceOfErc20!(
                addresses.WETH,
                walletAddress!,
                'L1'
              );
              if (wethBalance) {
                setBalance(parseCommified(wethBalance).toFixed(4).toString());
              }
              break;
          }
        } catch (e) {
          toast.error('Something went wrong');
          console.log(e);
        } finally {
          setBalanceLoading(false);
        }
      } else {
        setBalanceLoading(false);
      }
    }
    fetchData(true);
    const intervalId = setInterval(() => {
      fetchData(false);
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line
  }, [
    token,
    chainId,
    walletBalance,
    walletAddress,
    balanceOf,
    balanceOfErc20,
    selectedToken?.symbol,
  ]);

  return (
    <>
      <div className="d-flex justify-content-between pt-2">
        <span className="text-desc ps-2">{label}</span>
        <div>
          <span className="pe-2 pt-1" style={{ fontSize: '12px' }}>
            {balanceLoading && <Loading />}
            {!balanceLoading && (
              <>[{!isNaN((parseCommified(balance))) ? toFixedNoRounding(parseCommified(balance), 3) : 0}]</>
            )}
          </span>
          <span className='text-danger pe-2' style={{ fontSize: '12px' }}
            onClick={() => setAmount(toFixedNoRounding(parseCommified(balance), 3).toString())}
          >
            max{' '}
          </span>
        </div>
      </div>
      <div className="d-flex justify-content-between py-2">
        <input
          type="number"
          min={0}
          className="text-desc stake-txt-input ps-2"
          placeholder={displayAmount}
          value={amount}
          onChange={(event) => onChange(event.target.value)}
        />
        <span
          className="pe-2 pointer"
          onClick={() => {
            openTokenSelector('from');
          }}
        >
          {selectedToken?.symbol ? selectedToken?.symbol : 'Select'}▼
        </span>
      </div>
    </>
  );
}

export default TokenInput;
