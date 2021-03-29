### Nextjs + React-testing-library로 배우는 모던 리액트 소프트웨어 테스트

[Udemy 강의 링크](https://www.udemy.com/course/nextjs-react-testing-library-react/)

일시: 2021-03-25~

- 이 강의로 배울 수 있는 것

  - TypeScript의 Nextjs 적용법
  - Jest 및 Testing Library의 사용법

- Jest는 이전에 [TDD 강의](https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-tdd)를 들어서 문법 사용에 위화감없이 적응 가능했음

- Chapter 5: Testing of page navigation 강의를 듣던 도중에 테스트 케이스가 실패

  - 서버 사이드에서 정적으로 렌더링된 페이지를 검사하는 것이므로 중간에 데이터를 바꾸면 테스트에서는 이전 데이터를 사용하기 때문에 에러를 리턴하게 됨

- Chapter 7: Testing of getStaticProps/getStaticPaths 강의를 듣던 도중에 테스트 케이스가 실패
  - 테스트 라이브러리에서 기본적으로 'https://jsonplaceholder.typicode.com/posts/?_limit=10'의 URL로 받아오는 데이터를 제공함
  - 따라서 더미 데이터가 아니라 실제 타이틀 'sunt aut facere(이하략)'과 같은 타이틀로 입력해야 함
  - body로 받아오는 텍스트가 완벽히 테스트 되지 않는 불편함이 있음

```javascript
//원래 코드
const handlers = [
  rest.get(
    'https://jsonplaceholder.typicode.com/posts/?_limit=10',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'dummy title 1',
            body: 'dummy body 1',
          },
          {
            userId: 2,
            id: 2,
            title: 'dummy title 2',
            body: 'dummy body 2',
          },
        ])
      )
    }
  ),
]
/*
[MSW] Found a redundant usage of query parameters in the request handler URL for "GET https://jsonplaceholder.typicode.com/todos/?_limit=10". Please match against a path instead, and access query parameters in the response resolver function:
    
    rest.get("/posts/", (req, res, ctx) => {
      const query = req.url.searchParams
      const _limit = query.get("_limit=10")
    })      
*/
// warn 메세지에 맞춰 수정한 코드
const handlers = [
  rest.get('/posts/', (req, res, ctx) => {
    const query = req.url.searchParams
    const _limit = query.get('_limit=10')
    // query.get('1')로 입력하면 id가 1인 데이터를 가져옴
  }),
]
```

### useSWR (Stale while revalidation)

- useSWR을 사용할 때 주목해야 할 Options ([공식 문서 링크](https://swr.vercel.app/docs/options))
  - **initialData**: initial data to be returned (note: This is per-hook) (details)
  - **revalidateOnMount**: enable or disable automatic revalidation when component is mounted (by default revalidation occurs on mount when initialData is not set, use this flag to force behavior)
  - **refreshInterval = 0**: polling interval (disabled by default) (details)
  - **dedupingInterval = 2000**: dedupe requests with the same key in this time span

### getByText와 findByText를 주의해서 사용하기 (3/29)

[참고 페이지](https://blog.rhostem.com/posts/2020-10-15-beginners-guide-to-testing-react-2)

### Vercel에 Deploy하기

- Build & Development Settings에서 npm test && npm run build로 Override하면 테스트가 이루어지고 pass 했을 때에만 빌드 되도록 할 수 있다
- ![image](https://user-images.githubusercontent.com/67398691/112775382-b4936a80-9077-11eb-92f9-23cf39a1dfdb.png)

