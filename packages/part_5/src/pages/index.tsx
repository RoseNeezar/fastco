import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main className="flex flex-grow items-center justify-center ">
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src="/hero.jpeg" className="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold text-primary">Todo crud app</h1>
            <p className="py-6 text-secondary">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <Link href="/app" className="btn-primary btn">
              Go to App
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
