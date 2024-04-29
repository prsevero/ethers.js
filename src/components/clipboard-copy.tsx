import { useCallback } from 'react'

export default function ClipboardCopy ({
  text,
} : {
  text: string
}) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
  }, [text])

  return (
    <button
      className="opacity-80 outline-0 transition-opacity duration-200 hover:opacity-100"
      onClick={handleCopy}
      title="Copy"
      type="button"
    >
      <svg fill="#fff" height="24px" width="24px" viewBox="0 0 352.804 352.804">
        <g>
          <path d="M318.54,57.282h-47.652V15c0-8.284-6.716-15-15-15H34.264c-8.284,0-15,6.716-15,15v265.522c0,8.284,6.716,15,15,15h47.651
            v42.281c0,8.284,6.716,15,15,15H318.54c8.284,0,15-6.716,15-15V72.282C333.54,63.998,326.824,57.282,318.54,57.282z
             M49.264,265.522V30h191.623v27.282H96.916c-8.284,0-15,6.716-15,15v193.24H49.264z M303.54,322.804H111.916V87.282H303.54V322.804
            z"/>
        </g>
      </svg>
    </button>
  )
}
