import { faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Combobox, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import React, { Fragment, useState } from 'react';
import useSchoolsApi, { School, SCHOOLS } from '../api/schools';

const SchoolSelect: React.FC<{ schoolId?: string; onChange?: (schoolId: string) => any }> = ({
  schoolId,
  onChange
}) => {
  const { getSchools } = useSchoolsApi();
  const { data } = useQuery([SCHOOLS], getSchools);
  const [query, setQuery] = useState('');

  const filteredSchools =
    query === ''
      ? data?.schools
      : data?.schools?.filter(school =>
          school.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <Combobox value={schoolId} onChange={onChange}>
      <div className="relative mb-2">
        <div className="relative w-full cursor-default ring-1 ring-slate-400 rounded-md shadow-md">
          <Combobox.Input
            className="w-full py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            displayValue={(schoolId: string) => data?.schools?.find(s => s.id === schoolId)?.name ?? ''}
            onChange={event => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FontAwesomeIcon icon={faAngleDown} className="h-3 w-3 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredSchools?.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>
            ) : (
              filteredSchools?.map(school => (
                <Combobox.Option
                  key={school.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-100 text-indigo-800' : 'text-gray-900'
                    }`
                  }
                  value={school.id}
                >
                  {({ selected }) => (
                    <>
                      <span className="block truncate">{school.name}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3  text-indigo-600">
                          <FontAwesomeIcon icon={faCheck} className="h-3 w-3" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default SchoolSelect;
