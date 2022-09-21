import { ForwardedRef, forwardRef, RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const Input = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { className, ...rest } = props;
  return (
    <input
      ref={ref}
      className={twMerge(
        `border-solid border-2 border-black rounded-md p-2 enabled:hover:shadow-lg focus:outline-indigo-600 ${
          className ?? ''
        }`
      )}
      {...rest}
    />
  );
});

export const UnderlineInput = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { className, ...rest } = props;
  return (
    <input
      ref={ref}
      className={twMerge(
        `border-b-2 border-t-0 border-r-0 border-l-0 border-solid border-b-black enabled:hover:shadow-lg focus:outline-none focus:border-b-indigo-600 ${
          className ?? ''
        }`
      )}
      {...rest}
    />
  );
});

export default Input;
