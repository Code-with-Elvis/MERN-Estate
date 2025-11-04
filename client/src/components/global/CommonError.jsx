const CommonError = ({ message }) => {
  return (
    <div className="px-4 text-center mt-20 pb-10">
      <p className="mb-5 text-center">{message}</p>
      <button
        className="px-6 py-2 text-sm font-medium bg-blue-600 rounded-full text-white-600"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
};
export default CommonError;
