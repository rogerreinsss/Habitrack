interface DecorProps {
  className?: string;
}

export function StarField({ className = "" }: DecorProps) {
  return (
    <div className={`star-field ${className}`} aria-hidden="true">
      <div className="star-field-glow" />
    </div>
  );
}

export function Aurora({ className = "" }: DecorProps) {
  return <div className={`aurora ${className}`} aria-hidden="true" />;
}
