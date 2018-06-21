import * as React from 'react'
import './index.less'
import { Input } from 'antd'
const Search = Input.Search


class Food extends React.Component {

  onSearch = v => {
    console.log(v)
  }

  render() {
    return (
      <div className='food'>
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          onSearch={this.onSearch}
        />
      </div>
    )
  }
}


export default Food
