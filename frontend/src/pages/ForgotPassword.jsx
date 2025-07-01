import { useState } from 'react'
import axios from 'axios'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/forgot-password', { email })
      setMessage(res.data.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal mengirim email')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        placeholder="Masukkan email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Kirim</button>
      <p>{message}</p>
    </form>
  )
}

export default ForgotPassword
