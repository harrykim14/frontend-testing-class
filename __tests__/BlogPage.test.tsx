import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

initTestHelpers();

const handlers = [
    rest.get(
      '/posts/',
      (req, res, ctx) => {
        const query = req.url.searchParams
        const _limit = query.get("_limit=10")
        }
    )
]

const server = setupServer(...handlers)
beforeAll(() => {
    server.listen()
})
afterEach(() => {
    server.resetHandlers()
    cleanup()
})
afterAll(() => {
    server.close()
})

describe('Blog page', () => {
    it('Should render the list of blogs pre-fetched by getStaticProps', async () => {
        const { page } = await getPage({
            route: '/blog-page',
        })
        render(page)
        expect(await screen.findByText('blog page')).toBeInTheDocument()
        expect(screen.getByText('sunt aut facere repellat provident occaecati excepturi optio reprehenderit')).toBeInTheDocument()
        expect(screen.getByText('qui est esse')).toBeInTheDocument()
    })
})