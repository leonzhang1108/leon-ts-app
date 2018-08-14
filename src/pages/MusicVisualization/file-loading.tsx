
import * as React from 'react'
import { Progress } from 'antd'
interface IProps {
  percent: number,
  loadingFail: boolean,
  formatPercent: (v: number) => string
}

class FileLoading extends React.Component<IProps> {
  render () {
    const { percent, formatPercent, loadingFail } = this.props
    return (
      <div className='loading-mask'>
        {
          percent === 0 && !loadingFail ? (
            <div className='loader'/>
          ) : (
            <Progress type='circle'
              percent={Number(percent) ? percent : 0}
              format={formatPercent}
              status={loadingFail ? 'exception' : Number(percent) === 100 ? 'success' : 'active' }
            />
          )
        }
      </div>
    )
  }
}
export default FileLoading
