import { Fragment, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Combobox, Menu, Transition } from "@headlessui/react";
import { useSearchParams } from "react-router-dom";
import { Map } from "./Map";
import API from "../API";
import Loader from "../components/Loader";

const locations = [
  "Tümü",
  "Hatay - Batı Kuzey",
  "Hatay - Batı Güney",
  "Hatay - Doğu",
  "Hatay - Kırıkhan",
  "Hatay - İskenderun",
  "Hatay - Samandağ",
  "Kahramanmaraş",
  "Gaziantep",
  "Malatya",
  "Adıyaman",
];

const showLocationsDropdown = false;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Home = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [location, setLocation] = useState(locations[0]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [form, setForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      entry_id: 0,
      epoch: 0,
      is_location_verified: "",
      latitude: "",
      longitude: "",
      full_text: "",
      formatted_address: "",
      user_approved: false,
    }
  );

  const filteredLocations =
    query === ""
      ? locations
      : locations.filter((locate) => {
          return locate.toLowerCase().includes(query.toLowerCase());
        });

  const getAddress = () => {
    setLoading(true);

    let areas = API.Areas.locationNotVerified().needNotVerified().getURL()
    console.log(areas)

    let entries = {}

    axios.get(areas).then(r => {
      entries = r.data.results
      setCount(entries.length)

      let entry = entries[Math.floor(Math.random()*entries.length)];

      return entry.entry_id
    }).then( id => {
      console.log("ENTRY ID:", id)
      axios.get(API.Feeds.getURL(id)).then( r => {
        let entry = r.data
        setForm({
          entry_id: entry.id,
          epoch: entry.epoch,
          latitude: entry.lat,
          longitude: entry.lng,
          full_text: entry.full_text,
          formatted_address: entry.formatted_address,
          user_approved: false,
        })

        setError(false)
      }).catch(err => {
        setError(true)
      })
    }).finally(() => {
      setLoading(false)
    }).catch(err => {
      setError(true)
    })
  };

  useEffect(() => {
    getAddress();
  }, [location]);

  return (
    <div className="min-h-full bg-zinc-900 text-zinc-100">

      <Loader isLoading={loading} />

      <div className="py-16 text-center px-4 md:px-0">
        <h1 className="text-3xl md:text-4xl font-bold">
          Deprem Adres Kontrolleri
        </h1>

        {id && (
          <p className="mt-2 text-zinc-400 text-sm md:text-base">
            <span className="font-semibold">{id}</span> ID'li adresi
            düzenliyorsun:
          </p>
        )}

        {!id && (
          <p className="mt-2 text-zinc-400 text-sm md:text-base">
            Toplam <span className="font-semibold">{count}</span> adet kontrol
            edilmemiş adres var.
          </p>
        )}

        {loading && (
          <p className="mt-8 text-green-400">
            Filtreye uygun adres aranıyor...
          </p>
        )}

        {!loading && showLocationsDropdown && (
          <div className="mt-4 mx-auto max-w-2xl">
            <Combobox as="div" value={location} onChange={setLocation}>
              <div className="relative">
                <Combobox.Input
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 placeholder:text-zinc-500 py-2 pl-3 pr-10 shadow-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(locate) => locate}
                />

                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-2 focus:outline-none">
                  <ChevronDownIcon
                    className="h-5 w-5 text-zinc-500"
                    aria-hidden="true"
                  />
                </Combobox.Button>

                {filteredLocations.length > 0 && (
                  <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredLocations.map((locate, index) => (
                      <Combobox.Option
                        key={index}
                        value={locate}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9 transition-colors",
                            active ? "bg-zinc-800 text-white" : "text-zinc-100"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(
                                  "ml-3 truncate dark:text-zinc-100",
                                  selected && "font-semibold"
                                )}
                              >
                                {locate}
                              </span>
                            </div>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-2",
                                  active ? "text-white" : "text-brand"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          </div>
        )}

        {!loading && error && (
          <p className="mt-8 text-red-400">Adres bulunamadı.</p>
        )}

        {!id && !error && (
          <form
            key={form.entry_id}
            onSubmit={(event) => {
              event.preventDefault();

              let formData = {
                is_location_verified: form.user_approved,
                latitude: form.latitude,
                longitude: form.longitude,
                formatted_address: form.formatted_address,
              }

              axios
                .patch(API.Areas.getUpdateURL())
                .then(() => getAddress())
                .catch(err => alert("Bilgieri gonderemedim. Bu hatayi almaya devam ederseniz, veri kontrol ekibine bildiriniz."))
            }}
            className="mt-4 flex flex-col gap-y-4 mx-auto max-w-2xl"
          >
            <h2 className="text-left">Afet Harita ID'si</h2>
            <input
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
              disabled={true}
              type="text"
              placeholder="ID"
              value={form.entry_id}
            />
            <h2 className="text-left">
              <span className="text-red-600 p-1">*</span> Google Maps Koordinatlari.
            </h2>
            <input
              className="h-10 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
              disabled={false}
              type="text"
              placeholder="Koordinatlar"
              pattern="^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$"
              onChange={(event) => {
                let coords = event.target.value.split(", ")
                setForm({ latitude: coords[0], longitude: coords[1] })
              }
              }
              value={`${form.latitude}, ${form.longitude}`}
            />

            <div className="flex items-center justify-start gap-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#F87171"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>
                Bildirim Zamanı:
                <span className="text-red-400 ml-2">
                  {new Date(form.epoch * 1000).toLocaleString()}
                </span>
              </p>
            </div>

            <h2 className="text-left">Orijinal Mesaj</h2>
            <textarea
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 h-64 resize-none disabled:opacity-50"
              disabled={true}
              placeholder="Orijinal Mesaj"
              defaultValue={form.full_text}
            />

            <h2 className="text-left">
              <span className="text-red-600 p-1">*</span>
              Tahmin Edilen Adres
            </h2>
            <textarea
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 h-16 resize-none disabled:opacity-50"
              placeholder="Tahmin Edilen Adres"
              onChange={(event) => setForm({ formatted_address: event.target.value })}
              defaultValue={form.formatted_address}
            />

            <div className="flex items-center gap-x-4">
              <span className="text-red-600 p-1">*</span>
              <input
                className="flex-0 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
                disabled={loading}
                type="checkbox"
                placeholder=""
                onChange={ (event) => {setForm({ user_approved: event.target.checked }) }}
              /> Bilgileri gozden gecirdim, dogru olduguna inaniyorum.
            </div>
            <div className="flex items-center gap-x-4">
              <a
                href={`https://www.google.com/maps/?q=${form.latitude},${form.longitude}&ll=${form.latitude},${form.longitude}&z=21`}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 border border-zinc-700 rounded-lg shadow cursor-pointer hover:opacity-80 bg-zinc-800 hover:bg-zinc-700 transition-colors inline-flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>

              <input
                className="flex-1 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
                disabled={true}
                type="text"
                placeholder="Lokasyon"
                value={`https://www.google.com/maps/?q=${form.latitude},${form.longitude}&ll=${form.latitude},${form.longitude}&z=21`}
              />
            </div>

            <div className="flex justify-evenly gap-x-4 grid-cols-2">
              <button
                disabled={loading || form.user_approved}
                onClick={getAddress}
                className="bg-red-800 border border-red-700 hover:bg-red-700 disabled:bg-zinc-800 transition-colors text-sm rounded-lg px-4 py-2 font-medium w-full"
              >
                Atla/Sonraki
              </button>
              <button
                disabled={loading || !form.user_approved}
                className="bg-green-800 border border-green-700 hover:bg-green-700 disabled:bg-zinc-800 transition-colors text-sm rounded-lg px-4 py-2 font-medium w-full"
              >
                Onayla
              </button>
            </div>
          </form>
        )}

        {!loading && !error && <Map lat={form.latitude} lng={form.longitude} />}
      </div>
    </div>
  );
};

export default Home;
