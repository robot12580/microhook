import { useLoading } from '../index';
/**
 * @input 
 * import { useLoading } from 'microhook';
 */

function fetchData(keyword: string) {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve(keyword + ': data received')
    }, 2000)
  })
}

function Demo() {
  const [result, { wrapRequset: requestData }] = useLoading<typeof fetchData>(fetchData);

  const handleClick = () => {
    requestData('1');
  }

  return <div>
    <button onClick={handleClick}>start fetch</button>
    <div>
      {
        result.loading ? 'loading' : result.data
      }
    </div>
  </div>
}

export {
  Demo
}