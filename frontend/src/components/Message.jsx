const Message = ({ variant, children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
      case "succcess": // keep the original typo for backwards compatibility
        return "bg-green-500/10 border-green-500/20 text-green-400";
      case "error":
      case "danger":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className={`p-4 border text-sm font-medium ${getVariantClass()}`}>
      {children}
    </div>
  );
};

export default Message;
