import { twMerge } from 'tailwind-merge';

export interface ButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    React.AriaAttributes {}

const Button = (props: ButtonProps) => {
  const { children, className, ...rest } = props;
  return (
    <button
      className={twMerge(
        `shadow enabled:hover:shadow-lg bg-indigo-600 text-white rounded-md m-2 py-2 px-4 hover:bg-indigo-800 disabled:bg-indigo-300 ${
          className ?? ''
        }`
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
