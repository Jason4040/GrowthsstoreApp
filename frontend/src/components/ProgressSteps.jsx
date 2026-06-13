const ProgressSteps = ({ step1, step2, step3 }) => {
  const steps = [
    { label: "Login", active: step1 },
    { label: "Shipping", active: step2 },
    { label: "Summary", active: step3 },
  ];

  return (
    <div className="flex justify-center items-center mt-8 mb-4 px-4">
      <div className="flex items-center w-full max-w-[550px]">
        {steps.map((step, index) => {
          const isCompleted = step.active;
          const isLast = index === steps.length - 1;
          const stepNumber = index + 1;

          return (
            <div
              key={step.label}
              className="flex items-center flex-1"
              style={isLast ? { flex: "0 0 auto" } : {}}
            >
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center border transition-all ${isCompleted
                      ? "bg-orange-600 border-orange-500 text-white"
                      : "bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-gray-600"
                    }`}
                >
                  <span className="text-sm font-semibold">{stepNumber}</span>
                </div>
                <span
                  className={`mt-2 text-xs font-semibold uppercase tracking-widest transition-colors ${isCompleted ? "text-orange-500" : "text-gray-600"
                    }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-4 mt-[-20px]">
                  <div
                    className={`h-[2px] w-full transition-all ${steps[index + 1]?.active
                        ? "bg-orange-600"
                        : "bg-gray-800"
                      }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
