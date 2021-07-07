import React, { useEffect, useState, useRef, useCallback } from 'react'
import { createWorker } from 'tesseract.js'
import { Progress } from 'antd'
import './index.less'

const readURL = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = (e: any) => res(e.target.result)
    reader.onerror = (e) => rej(e)
    reader.readAsDataURL(file)
  })
}

const Tesseract = () => {
  const inputRef = useRef<any>()
  const [result, setResult] = useState('')
  const [loadingStatus, setLoadingStatus] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<any>(null)
  const [imgSrc, setImgSrc] = useState<any>(null)

  const initWorker = useCallback(() => {
    return createWorker({
      logger: (m) => {
        const { progress, status } = m
        setLoadingStatus((loadingSts) => {
          if (!loadingSts.length) {
            return [{ progress, status }]
          } else {
            const isIncludes = !!loadingSts.find((res) =>
              res.status.includes(status)
            )
            if (isIncludes) {
              loadingSts.pop()
            }
            const filtered = loadingSts.filter((sts) => sts.progress === 1)
            return [...filtered, { progress, status }]
          }
        })
      },
      workerPath:
        'https://cdn.bootcdn.net/ajax/libs/tesseract.js/2.1.4/worker.min.js',
    })
  }, [])

  useEffect(() => {
    if (!source) return
    ;(async () => {
      setLoading(true)
      setResult('')
      setLoadingStatus([])
      const worker = initWorker()
      await worker.load()
      await worker.loadLanguage('chi_sim')
      await worker.initialize('chi_sim')
      const {
        data: { text },
      } = await worker.recognize(source)
      setResult(text)
      await worker.terminate()
      setLoading(false)
    })()
  }, [source])

  const onFileChange = useCallback((res) => {
    const { files } = inputRef.current || {}
    if (files && files.length) {
      const file = files[0]
      setSource(file)
      ;(async () => {
        const url = await readURL(file)
        setImgSrc(url)
      })()
    }
  }, [])

  return (
    <div className="tesseract-wrapper" >
      {imgSrc ? <div className="bg-img" style={{ backgroundImage: `url("${imgSrc}")`}} /> : null}
      {loading ? (
        <div className="progress-wrapper">
          {loadingStatus
            .filter((stus) => !!stus.progress)
            .map((status, key) => (
              <Progress
                key={key}
                className="progress-line"
                percent={status.progress * 100}
                format={() => status.status}
              />
            ))}
        </div>
      ) : (
        <div className="res-wrapper">
          <pre>{result}</pre>
        </div>
      )}

      <div className="upload-wrapper">
        <a className={`upload ${loading ? 'disappear' : ''}`}>
          <div className={`anticon anticon-ts-app icon-add`} />
          <input
            className="change"
            ref={inputRef}
            type="file"
            onChange={onFileChange}
            accept="image/png, image/jpeg"
          />
        </a>
      </div>
    </div>
  )
}

export default Tesseract
