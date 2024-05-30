interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
}

export default function Link({ children, ...rest }: LinkProps) {
  return (
    <a className="underline text-teal-900 transition-color duration-200 hover:text-teal-700" {...rest}>
      {children}
    </a>
  )
}
