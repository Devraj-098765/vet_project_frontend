
const AuthLayout = ({ title, subtitle, children }) => {
  return (
<div className="items-start justify-center block h-full grid-cols-1 gap-4 lg:grid lg:items-center lg:grid-cols-2">
  <div className="relative flex items-center justify-center h-32 overflow-hidden lg:h-screen bg-gradient-to-tr from-black to-gray-800">
    <div className="flex items-center justify-center gap-4">
        <img src="" alt="" />
      <h1 className="text-white font-semibold text-5xl">Vetcare</h1>
    </div>
  </div>
  <div>
    <div className="relative z-20 px-6 mx-auto lg:px-12 max-w-lg">
      <div className="mb-4 xl:mt-8">
        <div className="mt-6 mb-4 lg:mt-0">
        </div>

          <h2 className="pt-6 font-sans text-3xl font-black leading-tight">{title}</h2>

          <p className="text-gray-600 mt-3">{subtitle}</p>
      </div>
    
      {children}
    </div>
  </div>
</div>
  )
}

export default AuthLayout
