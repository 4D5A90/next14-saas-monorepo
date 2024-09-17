type TextSeparatorProps = {
  text?: string;
};
export const TextSeparator = ({ text }: TextSeparatorProps) => {
  return (
    <div className="my-2 flex items-center">
      <div className="flex-grow border-t border-muted" />
      <div className="mx-2 text-muted-foreground">{text ?? "or"}</div>
      <div className="flex-grow border-t border-muted" />
    </div>
  );
};
