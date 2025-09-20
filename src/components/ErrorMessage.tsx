interface ErrorMessageProps {
  message: string;
}
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="error">
      <span>❌ </span>
      {message}
    </p>
  );
}