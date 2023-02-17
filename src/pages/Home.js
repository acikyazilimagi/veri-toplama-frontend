import { Fragment, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Combobox, Menu, Transition } from '@headlessui/react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Map } from './Map';
const times = ['Tümü', '3 saat', '6 saat', '12 saat', '1 gün'];

const locations = [
  'Tümü',
  'Hatay - Batı Kuzey',
  'Hatay - Batı Güney',
  'Hatay - Doğu',
  'Hatay - Kırıkhan',
  'Hatay - İskenderun',
  'Hatay - Samandağ',
  'Kahramanmaraş',
  'Gaziantep',
  'Malatya',
  'Adıyaman',
];

const reasons = [
  'Seçiniz',
  'Enkaz Yanlış Pin',
  'Enkaz Dışı Yardımlar',
  'Hatalı ya da Spam',
  'Hata Yok',
  'Duplicate',
  'Kurtarıldı',
];

const types = ['Depremzede', 'Enkaz Yardım'];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Home = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [location, setLocation] = useState(locations[0]);
  const [time, setTime] = useState(times[0]);
  const [type, setType] = useState(types[0]);
  const [query, setQuery] = useState('');
  const [address, setAddress] = useState(null);
  const [reasonError, setReasonError] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [form, setForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      message: '',
      location: '',
      open_adress: '',
      apartman: '',
      reason: '',
      token: '',
    }
  );
  const filteredLocations =
    query === ''
      ? locations
      : locations.filter((locate) => {
          return locate.toLowerCase().includes(query.toLowerCase());
        });

  const getAddress = () => {
    setLoading(true);

    let startingAt = Math.floor(Date.now() / 1000);

    switch (time) {
      case 'Tümü':
      default:
        startingAt = 0;
        break;
      case '3 saat':
        startingAt = startingAt - 3 * 3600;
        break;
      case '6 saat':
        startingAt = startingAt - 6 * 3600;
        break;
      case '12 saat':
        startingAt = startingAt - 12 * 3600;
        break;
      case '1 gün':
        startingAt = startingAt - 86400;
        break;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/${
          id
            ? `admin/entries/${id}`
            : `get-location?city_id=${locations.findIndex(
                (_) => _ === location
              )}&starting_at=${startingAt}`
        }`,
        {
          headers: {
            'Auth-Key': token,
          },
        }
      )
      .then((response) => {
        let data = response.data;

        if (id) {
          setAddress(data);

          if (reasons.includes(data.reason)) {
            setReason(data.reason);
          }
        } else {
          setCount(data.count);

          setAddress(data.location);
        }
      })
      .finally(() => {
        setType(types[0]);

        setReason(reasons[0]);

        setForm({
          message: '',
          location: '',
          open_adress: '',
          apartman: '',
          reason: '',
        });

        setLoading(false);
      });
  };

  useEffect(() => {
    getAddress();
  }, [location, time]);

  return (
    <div className="min-h-full bg-zinc-900 text-zinc-100">
      <div
        className={`absolute z-10 h-full bg-zinc-900/60 w-full flex items-center justify-center transition-all ${
          loading ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <svg
          className="animate-spin h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

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

        {loading && !address && id && (
          <p className="mt-8 text-yellow-400">Adres bilgileri getiriliyor...</p>
        )}

        {loading && !address && !id && (
          <p className="mt-8 text-green-400">
            Filtreye uygun adres aranıyor...
          </p>
        )}

        {!id && (
          <div className="mt-8 max-w-2xl mx-auto grid grid-cols-2 gap-x-4">
            <Menu as="div" className="relative inline-block text-left h-10">
              <Menu.Button className="inline-flex w-full justify-between rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <span>{time}</span>

                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-lg bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {times.map((_, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              setTime(_);
                            }}
                            className={classNames(
                              active ? 'bg-zinc-700' : 'text-zinc-100',
                              'block px-4 py-2 text-sm cursor-pointer transition-colors'
                            )}
                          >
                            {_}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

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
                            'relative cursor-default select-none py-2 pl-3 pr-9 transition-colors',
                            active ? 'bg-zinc-800 text-white' : 'text-zinc-100'
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(
                                  'ml-3 truncate dark:text-zinc-100',
                                  selected && 'font-semibold'
                                )}
                              >
                                {locate}
                              </span>
                            </div>

                            {selected && (
                              <span
                                className={classNames(
                                  'absolute inset-y-0 right-0 flex items-center pr-2',
                                  active ? 'text-white' : 'text-brand'
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

        {!loading && !address && (
          <p className="mt-8 text-red-400">Adres bulunamadı.</p>
        )}

        {address && !id && (
          <form
            key={address.entry_id}
            onSubmit={(event) => {
              event.preventDefault();

              if (reason === reasons[0]) {
                setReasonError(true);
                return;
              }

              setReasonError(false);

              setLoading(true);

              let data = {
                id: address.entry_id,
                new_address: form.location
                  ? form.location
                  : address.original_location,
                open_address: form.open_address,
                apartment: form.apartment,
                reason: reason,
                type: types.findIndex((_) => _ === type),
                tweet_contents: address.original_message,
              };
              console.log(data);
              axios
                .post(`${process.env.REACT_APP_API_URL}/resolve`, data, {
                  headers: {
                    'Auth-Key': form.token,
                  },
                })
                .finally(() => {
                  getAddress();
                });
            }}
            className="mt-4 flex flex-col gap-y-4 mx-auto max-w-2xl"
          >
            <input
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
              disabled={true}
              type="text"
              placeholder="ID"
              onChange={(event) => setForm({ id: event.target.value })}
              defaultValue={address.entry_id}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="h-10 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
                disabled={true}
                type="text"
                placeholder="Enlem"
                onChange={(event) => setForm({ lat: event.target.value })}
                defaultValue={address.loc[0]}
              />

              <input
                className="h-10 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
                disabled={true}
                type="text"
                placeholder="Boylam"
                onChange={(event) => setForm({ lng: event.target.value })}
                defaultValue={address.loc[1]}
              />
            </div>

            <input
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500"
              type="text"
              placeholder="Açık Adres"
              onChange={(event) =>
                setForm({ open_address: event.target.value })
              }
            />

            <input
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500"
              type="text"
              placeholder="Apartman"
              onChange={(event) => setForm({ apartment: event.target.value })}
            />
            <Menu as="div" className="relative inline-block text-left h-10">
              <Menu.Button className="inline-flex w-full justify-between rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <span>{reason}</span>

                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-lg bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {reasons.map((_, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              setReason(_);
                            }}
                            className={classNames(
                              active ? 'bg-zinc-700' : 'text-zinc-100',
                              'block px-4 py-2 text-sm cursor-pointer transition-colors'
                            )}
                          >
                            {_}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {reasonError && (
              <p className="text-red-400 text-left">Bir sebep seçmelisiniz.</p>
            )}

            <textarea
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 h-64 resize-none disabled:opacity-50"
              disabled={true}
              placeholder="Orijinal Mesaj"
              onChange={(event) => setForm({ message: event.target.value })}
              defaultValue={address.original_message}
            />

            <div className="flex items-center gap-x-4">
              <a
                href={form.location ? form.location : address.original_location}
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
                required={reason !== reasons[0]}
                className="flex-1 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500"
                type="text"
                placeholder="Orijinal Lokasyon"
                onChange={(event) => setForm({ location: event.target.value })}
                defaultValue={address.original_location}
                pattern="^https:\/\/(goo.gl\/maps|maps.google.com|www\.google\.com\/maps)\S+"
                title="https://goo.gl/maps veya https://maps.google.com ile başlamalıdır."
              />
            </div>

            <div className="flex items-center gap-x-4">
              <input
                className="flex-1 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500"
                type="password"
                placeholder="Giriş Şifresi"
                defaultValue={token}
                onChange={(event) => setForm({ token: event.target.value })}
              />

              <button
                disabled={loading}
                className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm rounded-lg px-4 py-2 font-medium inline-flex items-center justify-center ml-auto"
              >
                Gönder
              </button>
            </div>
          </form>
        )}

        {address && id && (
          <form
            key={address.entry_id}
            onSubmit={(event) => {
              event.preventDefault();

              if (reason === reasons[0]) {
                setReasonError(true);
                return;
              }

              setReasonError(false);

              setLoading(true);

              let data = {
                id: address.entry_id,
                new_address: form.location
                  ? form.location
                  : address.original_location,
                open_address: form.open_address,
                apartment: form.apartment,
                reason: reason,
                type: types.findIndex((_) => _ === type),
                tweet_contents: address.original_message,
              };
              console.log(data);
              axios
                .post(`${process.env.REACT_APP_API_URL}/resolve`, data, {
                  headers: {
                    'Auth-Key': form.token,
                  },
                })
                .finally(() => {
                  window.location.href = '/dogrula';
                });
            }}
            className="mt-8 flex flex-col gap-y-4 mx-auto max-w-2xl"
          >
            <input
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
              disabled={true}
              type="text"
              placeholder="ID"
              onChange={(event) => setForm({ id: event.target.value })}
              defaultValue={address.entry_id}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="h-10 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
                type="text"
                placeholder="Enlem"
                onChange={(event) => setForm({ lat: event.target.value })}
                defaultValue={address.location[0]}
              />

              <input
                className="h-10 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
                type="text"
                placeholder="Boylam"
                onChange={(event) => setForm({ lng: event.target.value })}
                defaultValue={address.location[1]}
              />
            </div>

            <input
              required={reason !== reasons[0]}
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500"
              type="text"
              placeholder="Açık Adres"
              defaultValue={address.open_address}
              onChange={(event) =>
                setForm({ open_address: event.target.value })
              }
            />

            <input
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500"
              type="text"
              placeholder="Apartman"
              defaultValue={address.apartment}
              onChange={(event) => setForm({ apartment: event.target.value })}
            />

            <Menu as="div" className="relative inline-block text-left h-10">
              <Menu.Button className="inline-flex w-full justify-between rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <span>{reason}</span>

                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-lg bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {reasons.map((_, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              setReason(_);
                            }}
                            className={classNames(
                              active ? 'bg-zinc-700' : 'text-zinc-100',
                              'block px-4 py-2 text-sm cursor-pointer transition-colors'
                            )}
                          >
                            {_}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {reasonError && (
              <p className="text-red-400 text-left">Bir sebep seçmelisiniz.</p>
            )}

            <textarea
              className="rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 h-64 resize-none disabled:opacity-50"
              disabled={true}
              placeholder="Orijinal Mesaj"
              onChange={(event) => setForm({ message: event.target.value })}
              defaultValue={address.tweet_contents}
            />

            <div className="flex items-center gap-x-4">
              <a
                href={form.location ? form.location : address.original_address}
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
                required={reason !== reasons[0]}
                className="flex-1 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500"
                type="text"
                pattern="^https:\/\/(goo.gl\/maps|maps.google.com|www\.google\.com\/maps)\S+"
                title="https://goo.gl/maps veya https://maps.google.com ile başlamalıdır."
                placeholder="Orijinal Lokasyon"
                onChange={(event) => setForm({ location: event.target.value })}
                defaultValue={
                  address.corrected_address
                    ? address.corrected_address
                    : address.original_address
                }
              />
            </div>

            <div className="flex items-center gap-x-4">
              <input
                className="flex-1 rounded-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 disabled:opacity-50"
                type="password"
                placeholder="Giriş Şifresi"
                disabled={true}
                defaultValue={token}
                onChange={(event) => setForm({ token: event.target.value })}
              />

              <a
                href="/dogrula"
                className="w-36 h-10 border border-zinc-700 rounded-lg text-sm shadow cursor-pointer hover:opacity-80 bg-zinc-800 hover:bg-zinc-700 transition-colors inline-flex items-center justify-center gap-x-2"
              >
                <ArrowLeftIcon className="h-4" />

                <span>Geri Dön</span>
              </a>

              <button
                disabled={loading}
                className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm rounded-lg px-4 py-2 font-medium inline-flex items-center justify-center ml-auto"
              >
                Gönder
              </button>
            </div>
          </form>
        )}
        <div className="mt-8 max-w-2xl mx-auto grid grid-cols-2 gap-x-4">
          {address && <Map lat={address.loc[0]} lng={address.loc[1]} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
