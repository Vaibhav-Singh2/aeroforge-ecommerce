export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex space-x-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-blue-600 delay-0"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-blue-600 delay-150"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-blue-600 delay-300"></div>
      </div>
    </div>
  );
}
