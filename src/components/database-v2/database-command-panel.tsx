import { FC, ReactNode } from 'react'

interface IDatabaseCommandPanel {
	children: ReactNode
	documentNumber: string
}
export const DatabaseCommandPanel: FC<IDatabaseCommandPanel> = ({ children, documentNumber }) => {

	return (
		<div className="pt-1">{children}
			<div className="cyop-text-hr-1 cyop-text-hr-1--center">
				{
					documentNumber &&
					<div className='d-flex flex-column gap-1 align-items-center'>
						<span className='text-desc' style={{ fontSize: '0.7rem' }}>DOCUMENT NUMBER</span>
						<div className='doc-number'>
							<span className='main-number'>{documentNumber.slice(0, 2)}</span>
							<span >{documentNumber.slice(2)}</span>
						</div>
					</div>
				}
			</div>
		</div>
	)
}

export default DatabaseCommandPanel
