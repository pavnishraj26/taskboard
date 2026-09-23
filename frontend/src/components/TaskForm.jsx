import { useState } from 'react'

const EMPTY = { title: '', description: '', assignee: '' }

// Controlled form for creating a task. Title is required; the submit button
// stays disabled until it has a value.
export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(true)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      await onCreate({
        title: form.title.trim(),
        description: form.description.trim() || null,
        assignee: form.assignee.trim() || null,
      })
      setForm(EMPTY)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="task-panel">
      <button
        type="button"
        className="task-panel-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Hide new task' : 'New task'}
      </button>
      {open && (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          value={form.title}
          onChange={update('title')}
          placeholder="e.g. Wire up the /api/tasks endpoint"
        />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={update('description')} rows={2} />
      </label>
      <label>
        Assignee
        <input value={form.assignee} onChange={update('assignee')} />
      </label>
      <button type="submit" className="primary" disabled={!form.title.trim() || submitting}>
        {submitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
      )}
    </section>
  )
}
