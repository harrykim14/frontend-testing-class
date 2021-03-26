import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'

initTestHelpers()

const handlers = [
    rest.get(
        '/posts/',
        (req, res, ctx) => {
        const query = req.url.searchParams
        const _limit = query.get("1")
    }),
    rest.get(
        '/posts/',
        (req, res, ctx) => {
        const query = req.url.searchParams
        const _limit = query.get("2")
    }),
];

const server = setupServer(...handlers);
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

describe(`Blog detail page`, () => {
    it('should render detailed content of ID 1', async () => {
        const { page } = await getPage({
            route: '/posts/1',
        })
        render(page)
        expect(await screen.findByText('sunt aut facere repellat provident occaecati excepturi optio reprehenderit')).toBeInTheDocument()
        // expect(await screen.findByText(expectedData)).toBeInTheDocument()
    })
    it('should render detailed content of ID 2', async () => {
        const { page } = await getPage({
            route: '/posts/2',
        })
        render(page)
        expect(await screen.findByText('qui est esse')).toBeInTheDocument()
        // expect(await screen.findByText(expectedData)).toBeInTheDocument()
    })
    it('should router back to blog-page from detail page', async () => {
        const { page } = await getPage({
            route: '/posts/2',
        })
        render(page)
        await screen.findByText('qui est esse')
        userEvent.click(screen.getByTestId('back-blog'))
        expect(await screen.findByText('blog page')).toBeInTheDocument()
        // await 순서에 맞춰 실행할 것
    })
})