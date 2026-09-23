import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskCard, { assigneeInitials, formatTaskAge } from '../TaskCard'

const baseTask = {
  id: 1,
  title: 'Write the schema',
  description: 'Define the tasks table',
  status: 'todo',
  assignee: 'Priya',
}

describe('TaskCard', () => {
  it('shows the title, description and assignee', () => {
    render(<TaskCard task={baseTask} onAdvance={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Write the schema' })).toBeInTheDocument()
    expect(screen.getByText('Define the tasks table')).toBeInTheDocument()
    expect(screen.getByText('Assigned to Priya')).toBeInTheDocument()
    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('shows a two-letter chip and a relative created line', () => {
    const created = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    render(
      <TaskCard
        task={{ ...baseTask, assignee: 'Ana Ruiz', createdAt: created }}
        onAdvance={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('AR')).toBeInTheDocument()
    expect(screen.getByText('Created 3 days ago')).toBeInTheDocument()
  })

  it('derives initials and created phrasing', () => {
    expect(assigneeInitials('Ana Ruiz')).toBe('AR')
    expect(assigneeInitials('Priya')).toBe('P')
    expect(assigneeInitials('  ')).toBe('')
    const now = new Date('2026-09-23T12:00:00Z')
    expect(formatTaskAge('2026-09-23T11:59:30Z', now)).toBe('just now')
    const older = formatTaskAge('2026-08-01T12:00:00Z', now)
    expect(older).not.toMatch(/ago/)
    expect(older).toMatch(/2026/)
  })

  it('advances a todo task to in-progress', async () => {
    const onAdvance = vi.fn()
    render(<TaskCard task={baseTask} onAdvance={onAdvance} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /Move to In Progress/ }))
    expect(onAdvance).toHaveBeenCalledWith(baseTask, 'in-progress')
  })

  it('has no advance button for a done task', () => {
    render(
      <TaskCard task={{ ...baseTask, status: 'done' }} onAdvance={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.queryByRole('button', { name: /Move to/ })).not.toBeInTheDocument()
  })

  it('deletes when the delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(<TaskCard task={baseTask} onAdvance={vi.fn()} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledWith(baseTask)
  })

  it('shows the comment control without a count when there are no comments', () => {
    render(<TaskCard task={baseTask} onAdvance={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('button', { name: '💬' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '💬 3' })).not.toBeInTheDocument()
  })

  it('shows the comment count when the task has comments', () => {
    render(
      <TaskCard
        task={{ ...baseTask, commentCount: 3 }}
        onAdvance={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: '💬 3' })).toBeInTheDocument()
  })

  it('expands the thread oldest-first and collapses it again', async () => {
    const onToggle = vi.fn()
    const comments = [
      { id: 1, author: 'Ana', body: 'First', createdAt: '2026-09-21T09:00:00' },
      { id: 2, author: 'Priya', body: 'Second', createdAt: '2026-09-21T10:00:00' },
    ]
    const { rerender } = render(
      <TaskCard
        task={{ ...baseTask, commentCount: 2 }}
        comments={comments}
        commentsOpen={false}
        onAdvance={vi.fn()}
        onDelete={vi.fn()}
        onToggleComments={onToggle}
      />,
    )
    expect(screen.queryByText('First')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '💬 2' }))
    expect(onToggle).toHaveBeenCalledWith({ ...baseTask, commentCount: 2 })

    rerender(
      <TaskCard
        task={{ ...baseTask, commentCount: 2 }}
        comments={comments}
        commentsOpen
        onAdvance={vi.fn()}
        onDelete={vi.fn()}
        onToggleComments={onToggle}
      />,
    )
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('First')
    expect(items[1]).toHaveTextContent('Second')

    await userEvent.click(screen.getByRole('button', { name: '💬 2' }))
    expect(onToggle).toHaveBeenCalledTimes(2)
  })

  it('does not post when author or body is blank', async () => {
    const onPost = vi.fn()
    render(
      <TaskCard
        task={baseTask}
        commentsOpen
        onAdvance={vi.fn()}
        onDelete={vi.fn()}
        onPostComment={onPost}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Post' }))
    expect(onPost).not.toHaveBeenCalled()
  })

  it('posts trimmed author and body', async () => {
    const onPost = vi.fn()
    render(
      <TaskCard
        task={baseTask}
        commentsOpen
        onAdvance={vi.fn()}
        onDelete={vi.fn()}
        onPostComment={onPost}
      />,
    )
    await userEvent.type(screen.getByLabelText('Author'), '  Ana  ')
    await userEvent.type(screen.getByLabelText('Comment'), '  Looks good  ')
    await userEvent.click(screen.getByRole('button', { name: 'Post' }))
    expect(onPost).toHaveBeenCalledWith(baseTask, { author: 'Ana', body: 'Looks good' })
  })

  it('deletes a comment without a confirm dialog', async () => {
    const onDeleteComment = vi.fn()
    const comment = { id: 8, author: 'Ana', body: 'Remove me', createdAt: '2026-09-21T09:00:00' }
    render(
      <TaskCard
        task={{ ...baseTask, commentCount: 1 }}
        comments={[comment]}
        commentsOpen
        onAdvance={vi.fn()}
        onDelete={vi.fn()}
        onDeleteComment={onDeleteComment}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Delete comment' }))
    expect(onDeleteComment).toHaveBeenCalledWith({ ...baseTask, commentCount: 1 }, comment)
  })
})
