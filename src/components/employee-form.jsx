import { useState, useTransition } from "react"

export default function EmployeeForm({ action }) {
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  return (
    <form
      action={(fd) => {
        fd.set("emp_name", name)
        fd.set("emp_mail_id", email)
        startTransition(async () => {
          await action(fd)
          setName("")
          setEmail("")
        })
      }}
      className="grid gap-4"
    >
      <div className="form-group">
        <label htmlFor="emp_name" className="form-label">Employee name</label>
        <input 
          id="emp_name" 
          type="text"
          className="form-input"
          placeholder="Jane Doe" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="emp_mail_id" className="form-label">Email</label>
        <input
          id="emp_mail_id"
          type="email"
          className="form-input"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Saving…" : "Add Employee"}
      </button>
    </form>
  )
}
