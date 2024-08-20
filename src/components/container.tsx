type ContainerProps = {
  children: React.ReactNode;
};
export default function Container({ children }: ContainerProps) {
  return (
    <div className="flex flex-col max-w-6xl min-h-screen mx-auto bg-secondcolor">
      {children}
    </div>
  );
}
