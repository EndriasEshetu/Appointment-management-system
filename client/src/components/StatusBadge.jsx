const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-900/30 text-yellow-500 border border-yellow-900/50",
    confirmed: "bg-blue-900/30 text-blue-400 border border-blue-900/50",
    paid: "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30",
    cancelled: "bg-red-900/30 text-red-400 border border-red-900/50",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
        styles[status] || "bg-gray-800 text-gray-400 border border-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
