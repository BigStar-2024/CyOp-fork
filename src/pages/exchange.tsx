import { useEffect, VFC } from "react"
import ExchangeLeftPanel from "components/exchange-left-panel"
import ExchangePriceChart from "components/exchange-price-chart"

export const ExchangePage:VFC<{setPath: (path: string) => void}> = ({setPath}) => {

	useEffect(() => {
			setPath("/exchange");
	}, []);

	return (
		<div className="d-flex h-100" style={{ overflowY: 'auto' }}>
			<div className="container-fluid">
				<div className="row h-100">
					<div className="col-12 col-lg-6 ">
						<div className="cyop-border-right h-100">
							<ExchangeLeftPanel />
						</div>
					</div>
					<div className="col-12 col-lg-6  mt-2 mt-lg-0">
						<div className="cyop-border-top-down-lg" />
						<ExchangePriceChart />
					</div>
				</div>
			</div>
		</div>
	)
}

export default ExchangePage