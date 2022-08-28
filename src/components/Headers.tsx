import { twMerge } from 'tailwind-merge';

interface HeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {}

const H1 = (props: HeaderProps) => {
  const { children, className, ...rest } = props;
  return (
    <h1 className={twMerge(`text-3xl font-extrabold ${className ?? ''}`)} {...rest}>
      {children}
    </h1>
  );
};

export default H1;
