// biome-ignore lint/complexity/noBannedTypes: explanation
export type IconProps<T = {}> = {
  className?: string;
  color?: string;
  direction?: "up" | "down" | "left" | "right";
  fillOpacity?: string;
} & T;

// biome-ignore lint/complexity/noBannedTypes: explanation
export type Icon<T = {}> = React.FC<IconProps<T>>;
