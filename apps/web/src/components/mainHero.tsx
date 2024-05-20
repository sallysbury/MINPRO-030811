export default function MainHero() {
  return (
    <section className="head bg-white pt-20">
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <header className="text-center">
      <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">New Concert</h2>

      <p className="mx-auto mt-4 max-w-md text-gray-500">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque praesentium cumque iure
        dicta incidunt est ipsam, officia dolor fugit natus?
      </p>
    </header>

    <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <li>
        <a href="#" className="group relative block">
          <img
            src="https://images.unsplash.com/photo-1583470037890-73cc6850b7eb?q=80&w=4031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
          />

          <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
            <h3 className="text-xl font-medium text-white">Casual Trainers</h3>

            <span
              className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
              Shop Now
            </span>
          </div>
        </a>
      </li>

      <li>
        <a href="#" className="group relative block">
          <img
            src="https://images.unsplash.com/photo-1573152958734-1922c188fba3?q=80&w=4032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
          />

          <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
            <h3 className="text-xl font-medium text-white">Winter Jumpers</h3>

            <span
              className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
              Shop Now
            </span>
          </div>
        </a>
      </li>

      <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <a href="#" className="group relative block">
          <img
            src="https://images.unsplash.com/photo-1556848798-ee649b672584?q=80&w=3376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
          />

          <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
            <h3 className="text-xl font-medium text-white">Solo</h3>

            <span
              className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
              Shop Now
            </span>
          </div>
        </a>
      </li>
    </ul>
  </div>
 
<section
  className="overflow-hidden bg-[url(https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvbmNlcnR8ZW58MHx8MHx8fDA%3D)] bg-cover bg-top bg-no-repeat"
>
  <div className="bg-black/25 p-8 md:p-12 lg:px-16 lg:py-24">
    <div className="text-center ltr:sm:text-left rtl:sm:text-right">
      <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl">Latest Event</h2>

      <p className="hidden max-w-lg text-white/90 md:mt-6 md:block md:text-lg md:leading-relaxed">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore officia corporis quasi
        doloribus iure architecto quae voluptatum beatae excepturi dolores.
      </p>

      <div className="mt-4 sm:mt-8">
        <a
          href="#"
          className="inline-block rounded-full bg-white px-12 py-3 text-sm font-medium text-black transition hover:bg-gray-700 focus:outline-none focus:ring focus:ring-yellow-400"
        >
          Create Your Event Now
        </a>
      </div>
    </div>
  </div>
</section>
</section>
  );
}
