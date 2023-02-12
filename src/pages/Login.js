import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [text, setText] = useState("");
  const [loggedIn, setLoggedIn] = useState(null);

  return (
    <div className="min-h-screen text-zinc-100 flex items-center justify-center flex-col px-4 md:px-0">
      <h1 className="text-3xl md:text-4xl font-bold ">Giriş Yap</h1>

      <form
        className="mt-8 flex flex-col gap-y-2"
        onSubmit={(event) => {
          event.preventDefault();

          axios
            .get(`${process.env.REACT_APP_API_URL}/admin/entries`, {
              headers: {
                "Auth-Key": text,
              },
            })
            .then(() => {
              localStorage.setItem("token", text);

              setLoggedIn(true);

              setTimeout(() => {
                window.location.reload();
              }, 1500);
            })
            .catch(() => {
              setLoggedIn(false);
            });
        }}
      >
        <input
          required={true}
          className="w-72 text-sm rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500"
          type="text"
          placeholder="Şifre"
          onChange={(event) => setText(event.target.value)}
        />

        {loggedIn === false && (
          <p className="mt-2 text-red-400">Şifre yanlış.</p>
        )}

        {loggedIn === true && (
          <p className="mt-2 text-green-400">
            Giriş başarılı, yönlendiliyorsunuz..
          </p>
        )}

        <button className="mt-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm rounded-lg px-4 py-2 font-medium inline-flex items-center justify-center ">
          Gönder
        </button>
      </form>
    </div>
  );
};

export default Login;
