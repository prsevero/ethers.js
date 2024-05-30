import Loading from '@/components/loading'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  loading?: boolean
  size?: string
}

export default function Button({ children, className, loading, size = 'md', ...rest }: ButtonProps) {
  const cssClass = `
    bg-sky-600
    flex
    ${size === 'sm' ? 'text-sm' : ''}
    font-semibold
    gap-2
    outline-0
    ${size === 'sm' ? 'px-3' : 'px-6'}
    ${size === 'sm' ? 'py-2' : 'py-3'}
    rounded-lg
    text-white
    transition-background
    duration-200
    disabled:bg-slate-500
    disabled:text-slate-300
    hover:bg-sky-500 ${className || ''}
  `

  return (
    <button
      className={cssClass}
      disabled={loading}
      {...rest}
    >
      {children}
      {loading && <Loading />}
    </button>
  )
}
