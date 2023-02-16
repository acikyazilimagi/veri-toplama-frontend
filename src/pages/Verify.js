import Login from "./Login";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { chunk } from "lodash";
import { PencilIcon } from "@heroicons/react/24/outline";

const PER_PAGE = 20;

const Verify = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(0);
  const [correctSort, setCorrectSort] = useState(null);
  const [verifiedSort, setVerifiedSort] = useState(null);
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/admin/entries`, {
          headers: {
            "Auth-Key": token,
          },
        })
        .then((response) => {
          setLoggedIn(true);

          setEntries(response.data);
        })
        .catch(() => {
          setLoggedIn(false);
        });
    } else {
      setLoggedIn(false);
    }
  }, [token]);

  useEffect(() => {
    setPage(0);
  }, [correctSort, verifiedSort]);

  if (loggedIn === false) {
    return <Login />;
  }

  if (!entries) {
    return null;
  }

  let sortedEntries = entries.filter((entry) => {
    let final = true;

    if (correctSort === true) {
      final = entry.corrected;
    }

    if (verifiedSort === true && final) {
      final = entry.verified;
    }

    return final;
  });

  let chunkedEntries = chunk(sortedEntries, PER_PAGE);

  return (
    <div className="min-h-screen py-16 text-zinc-100 px-4 md:px-0">
      <div className="flex flex-col max-w-5xl mx-auto">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-zinc-600">
                <thead className="bg-zinc-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                    ></th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                    >
                      <div className="group inline-flex">ID</div>
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      <div className="group inline-flex">Konum</div>
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      <div className="group inline-flex">Orijinal Adres</div>
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold "
                    >
                      <div className="group inline-flex">Düzeltilmiş Adres</div>
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      <div className="group inline-flex">Açık Adres</div>
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      <div className="group inline-flex">Apartman</div>
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      <div className="group inline-flex">Sebep</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-700 bg-zinc-900">
                  {(chunkedEntries[page] ?? []).map((entry) => (
                    <tr key={entry.entry_id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                        <a
                          href={`/?id=${entry.entry_id}&token=${token}`}
                          className="h-8 w-8 border border-zinc-700 rounded-lg shadow cursor-pointer hover:opacity-80 bg-zinc-800 hover:bg-zinc-700 transition-colors inline-flex items-center justify-center"
                        >
                          <PencilIcon className="h-3" />
                        </a>
                      </td>

                      <td
                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 ${
                          entry.verified ? "text-green-400" : "text-current"
                        }`}
                      >
                        {entry.entry_id}
                      </td>

                      <td
                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 ${
                          entry.corrected ? "text-yellow-400" : "text-current"
                        }`}
                      >
                        {entry.location[0] + "," + entry.location[1]}
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                        <a
                          href={entry.original_address}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Konuma Git
                        </a>
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 w-">
                        {entry.corrected_address && (
                          <a
                            rel="noreferrer"
                            href={entry.original_address}
                            target="_blank"
                            className="underline"
                          >
                            Konuma Git
                          </a>
                        )}
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                        {entry.open_address}
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                        {entry.apartment}
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                        {entry.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-y-4 items-center justify-between mt-8 select-none">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");

                window.location.reload();
              }}
              className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm rounded-lg px-4 py-2 font-medium inline-flex items-center justify-center"
            >
              Çıkış Yap
            </button>

            <button
              onClick={() => {
                setCorrectSort(!correctSort);
              }}
              className={`bg-zinc-900 border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm rounded-lg px-4 py-2 font-medium inline-flex items-center justify-center ${
                correctSort && "opacity-50"
              }`}
            >
              Düzeltilmiş
            </button>

            <button
              onClick={() => {
                setVerifiedSort(!verifiedSort);
              }}
              className={`bg-zinc-900 border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm rounded-lg px-4 py-2 font-medium inline-flex items-center justify-center ${
                verifiedSort && "opacity-50"
              }`}
            >
              Onaylanmış
            </button>
          </div>

          <div className="flex items-center gap-x-4">
            <button
              disabled={page === 0}
              onClick={() => setPage((page) => page - 1)}
              className="h-10 w-10 border border-zinc-700 rounded inline-flex items-center justify-center font-bold hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeftIcon className="h-4" />
            </button>

            <div>
              {page + 1}. Sayfa ({chunkedEntries.length} içinden)
            </div>

            <button
              disabled={page + 1 >= chunkedEntries.length}
              onClick={() => setPage(page + 1)}
              className="h-10 w-10 border border-zinc-700 rounded inline-flex items-center justify-center font-bold hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronRightIcon className="h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
