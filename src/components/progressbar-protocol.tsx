interface IProgressBarProtocol {
    progress?: number,
    animateInterval?: number,
}

export const ProgressBarProtocol = ({ progress, animateInterval = 5 }: IProgressBarProtocol) => {

    return (
        <div className="co-progress-protocol mb-5 mb-xl-3"
        >
            {progress &&
                <>
                    <div className="progress-item progress-overall" style={{ width: '100%' }}></div>
                    <div className="progress-item progress-half" style={{ width: progress + 10 > 100 ? 100 : progress + 10 + '%' }}></div>
                    <div className="progress-item progress-current" style={{ width: progress + '%' }}></div>
                </>
            }
        </div>
    )
}

export default ProgressBarProtocol