import { Progress } from 'antd'
import React from 'react'
interface IProps {
  percent: number;
  loadingFail: boolean;
  formatPercent: (v: number) => string;
}

class FileLoading extends React.Component<IProps> {
  render() {
    const { percent, formatPercent, loadingFail } = this.props
    return (
      <div className="loading-mask">
        {percent === 0 && !loadingFail ? (
          <div className="loader" />
        ) : !loadingFail ? (
          <Progress
            type="circle"
            percent={Number(percent) ? percent : 0}
            format={formatPercent}
            status={
              loadingFail
                ? 'exception'
                : Number(percent) === 100
                  ? 'success'
                  : 'active'
            }
            className={`${
              !loadingFail && Number(percent) === 100 ? 'loading' : ''
            }`}
          />
        ) : (
          ''
        )}
      </div>
    )
  }
}
export default FileLoading
