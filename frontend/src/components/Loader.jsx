const Loader = () => {
  return (
    <div className="fixed inset-0 z-[99999] bg-white dark:bg-black flex justify-center items-center w-full h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-32 md:w-48 h-auto object-contain drop-shadow-2xl"
      >
        <source src="/loading.webm" type="video/mp4" />
      </video>
    </div>
  );
};

export default Loader;
