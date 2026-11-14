export default interface ICounterProps {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}
