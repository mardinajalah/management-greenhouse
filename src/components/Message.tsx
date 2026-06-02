type MessageProps = {
  message?: string;
};

export function Message({ message }: MessageProps) {
  if (!message) return null;
  return <>{message}</>;
}
