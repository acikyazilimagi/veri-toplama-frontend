import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const PDF =
  "https://cdn.discordapp.com/attachments/1073928426307735632/1073949076086849606/Veri-Kontrol_Rehber_Kullanm_Klavuzu.pdf";

const Agreement = () => {
  const [readed, setReaded] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  return (
    <div className="min-h-screen text-zinc-100 flex items-center justify-center px-4 md:px-0">
      <form
        onSubmit={(event) => {
          event.preventDefault();

          localStorage.setItem("agreed", "yes");

          setRedirecting(true);

          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }}
        className="w-full max-w-md mx-auto flex flex-col gap-y-4"
      >
        <iframe
          className="w-full h-64 rounded-lg shadow"
          src="https://drive.google.com/file/d/1DJOlnIPtFYPnJjQ7CIAy8LUz-4IelaVt/preview"
        ></iframe>

        <a
          href={PDF}
          target="_blank"
          className="w-full h-10 border border-zinc-700 rounded-lg shadow cursor-pointer hover:opacity-80 bg-zinc-800 hover:bg-zinc-700 transition-colors inline-flex items-center justify-center gap-x-2"
        >
          <ArrowDownOnSquareIcon className="h-4" />

          <span>Kullanım Kılavuzunu İndir</span>
        </a>

        <fieldset className="space-y-4">
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="readed"
                aria-describedby="readed-description"
                name="readed"
                type="checkbox"
                value={readed}
                required={true}
                onChange={(event) => {
                  setReaded(event.target.checked);
                }}
                className="h-4 w-4 rounded bg-zinc-900 border-zinc-700 text-indigo-600 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div className="ml-3 text-sm">
              <label htmlFor="readed">
                Kullanım kılavuzunu okudum, anladım.
              </label>
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="agreed"
                aria-describedby="agreed-description"
                name="agreed"
                type="checkbox"
                value={agreed}
                required={true}
                onChange={(event) => {
                  setAgreed(event.target.checked);
                }}
                className="h-4 w-4 rounded bg-zinc-900 border-zinc-700 text-indigo-600 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div className="ml-3 text-sm">
              <label htmlFor="agreed">
                Rehber videosunu izledim, onaylıyorum.
              </label>
            </div>
          </div>
        </fieldset>

        <div className="flex items-center">
          {redirecting && (
            <p className="text-green-400">
              Ana sayfaya yönlendiriliyorsunuz...
            </p>
          )}

          <button className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm rounded-lg px-4 py-2 font-medium inline-flex items-center justify-center ml-auto">
            Gönder
          </button>
        </div>
      </form>
    </div>
  );
};

export default Agreement;
