import { ForwardedRef, forwardRef, RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const Input = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { className, ...rest } = props;
  return (
    <input
      ref={ref}
      className={twMerge(
        `border-solid border-2 border-black rounded-md m-2 p-2 enabled:hover:shadow-lg focus:outline-indigo-600 ${
          className ?? ''
        }`
      )}
      {...rest}
    />
  );
});

export default Input;
