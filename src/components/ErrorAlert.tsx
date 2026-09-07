interface ErrorAlertProps {
  message: string;
  onReload: () => void;
}

export const ErrorAlert = ({ message, onReload }: ErrorAlertProps) => {
  return (
    <div className="text-center mt-4">
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
      <button
        type="button"
        className="reloadButton btn btn-secondary"
        onClick={onReload}
      >
        Повторить попытку
      </button>
    </div>
  );
};
